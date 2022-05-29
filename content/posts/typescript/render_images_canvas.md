---
title: 'Render images on a canvas in the correct order'
date: 2022-05-29T14:59:44+02:00
toc: true
tags: ['typescript', 'javascript', 'canvas', 'html5']
---

## What am I trying to achieve?

I want to render multiple images on a canvas in a specific order.

Let's say I have a BLUE image and a RED image and I want to render them in that order.

## How to render an image on a canvas?

Rendering a single image on a canvas is easy:

```typescript
const canvas = document.getElementById('my-canvas')
const context = canvas.getContext('2d')

const img = new Image()
// once the image is loaded, render it on canvas
img.onload = () => {
  context.drawImage(img, 0, 0)
}
img.src = './path/to/blue.png'
```

## How to render multiple images on a canvas?

Following the previous code, I only need to add a loop to render multiple images:

```typescript
const canvas = document.getElementById('my-canvas')
const context = canvas.getContext('2d')
const filepaths = ['./blue.png', './red.png']

for (let filepath in filepaths) {
  const img = new Image()
  img.onload = () => {
    context.drawImage(img, 0, 0)
  }
  img.src = filepath
}
```

## What is the problem?

Sometimes, images are rendered incorrectly. Instead of having BLUE partially hidden by RED, I have RED partially hidden by BLUE.

## Why?

`img.onload` is **only called when the image is fully loaded**.
Unfortunately, this means images are not always loaded in the order they were created.

## How to render in the correct order?

The idea is simple: you **have to** create the next image and render it **after** the previous one has been loaded.

In my case, I recursively render the next image once the current one is loaded:

```typescript
function drawImages(
  context: CanvasRenderingContext2D,
  filepaths: string[],
  index: number,
) {
  // stop when no filepath anymore
  if (index >= filepaths.length) {
    return
  }

  const filepath = filepaths[index]
  const img = new Image()
  img.onload = () => {
    context.drawImage(img, 0, 0)
    // draw the next image
    drawImages(context, filepaths, index + 1)
  }
  img.src = filepath
}

const canvas = document.getElementById('my-canvas')
const context = canvas.getContext('2d')
const filepaths = ['./blue.png', './red.png']

// draw all images
drawImages(context, filepaths, 0)
```

And there you have it!
