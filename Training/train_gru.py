import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report
import os

# Parameters
IMAGE_SIZE = 264
BATCH_SIZE = 32
CHANNELS = 3
EPOCHS = 20
N_CLASSES = 4

# Load dataset
dataset = tf.keras.preprocessing.image_dataset_from_directory(
    "Blood cell Cancer [ALL]",
    seed=123,
    shuffle=True,
    image_size=(IMAGE_SIZE, IMAGE_SIZE),
    batch_size=BATCH_SIZE
)

class_names = dataset.class_names
print("Class names:", class_names)

# Split dataset
def get_dataset_partitions_tf(ds, train_split=0.8, val_split=0.1, test_split=0.1, shuffle=True, shuffle_size=10000):
    assert (train_split + test_split + val_split) == 1
    ds_size = len(ds)
    if shuffle:
        ds = ds.shuffle(shuffle_size, seed=12)
    train_size = int(train_split * ds_size)
    val_size = int(val_split * ds_size)
    train_ds = ds.take(train_size)
    val_ds = ds.skip(train_size).take(val_size)
    test_ds = ds.skip(train_size).skip(val_size)
    return train_ds, val_ds, test_ds

train_ds, val_ds, test_ds = get_dataset_partitions_tf(dataset)

# Preprocessing
resize_and_rescale = tf.keras.Sequential([
    layers.Resizing(IMAGE_SIZE, IMAGE_SIZE),
    layers.Rescaling(1.0 / 255),
])

data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal_and_vertical"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.2),
    layers.RandomContrast(0.2),
    layers.RandomBrightness(0.1),
])

# Apply augmentation and preprocessing
train_ds = train_ds.map(
    lambda x, y: (data_augmentation(x, training=True), y),
    num_parallel_calls=tf.data.AUTOTUNE
).map(
    lambda x, y: (resize_and_rescale(x), y),
    num_parallel_calls=tf.data.AUTOTUNE
).cache().shuffle(1000).prefetch(buffer_size=tf.data.AUTOTUNE)

val_ds = val_ds.map(
    lambda x, y: (resize_and_rescale(x), y),
    num_parallel_calls=tf.data.AUTOTUNE
).cache().shuffle(1000).prefetch(buffer_size=tf.data.AUTOTUNE)

test_ds = test_ds.map(
    lambda x, y: (resize_and_rescale(x), y),
    num_parallel_calls=tf.data.AUTOTUNE
).cache().shuffle(1000).prefetch(buffer_size=tf.data.AUTOTUNE)

# Build CNN + GRU model
input_shape = (IMAGE_SIZE, IMAGE_SIZE, CHANNELS)
model = tf.keras.Sequential([
    # CNN feature extraction
    layers.Conv2D(32, 3, activation='relu', input_shape=input_shape),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(128, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(128, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(512, activation='relu'),
    layers.Dropout(0.5),
    # Reshape for GRU (treat as sequence of 4 timesteps with 128 features)
    layers.Reshape((4, 128)),
    layers.GRU(64, return_sequences=False),
    layers.Dense(N_CLASSES, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
    metrics=['accuracy']
)

model.summary()

# Train
history = model.fit(
    train_ds,
    epochs=EPOCHS,
    validation_data=val_ds,
    verbose=1
)

# Evaluate
scores = model.evaluate(test_ds)
print("Test accuracy:", scores[1])

# Predictions for report
y_pred = model.predict(test_ds)
y_pred_classes = np.argmax(y_pred, axis=1)
y_true = np.concatenate([y for x, y in test_ds], axis=0)
print(classification_report(y_true, y_pred_classes, target_names=class_names))

# Save model
model_version = 4
tf.saved_model.save(model, f"../models/{model_version}")
print(f"Model saved to ../models/{model_version}")
