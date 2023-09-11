---
title: "Custom external tooltip in ChartJS (React, TypeScript, ChakraUI)"
tags: ["typescript", "react", "chakra-ui", "chartjs"]
category: ["tutorial"]
toc: true
date: 2023-09-11T23:00:00+02:00
---

## Problem

My application is in React and TypeScript.
I am using ChartJS to draw line charts and I want to completely customize the tooltips displayed on my chart.

## Requirements

- ChartJS
- React
- react-chartjs-2

### A line chart with tooltip enabled

Here is an example of a line chart with tooltips enabled.
We will build on it to implement an external tooltip.

```typescript
import {
  CategoryScale,
  Chart,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register([
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
]);

const App = () => <LineChart />;

const LineChart = () => {
  return (
    <Line
      data={FAKE_DATA}
      options={{
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          tooltip: {
            enabled: true,
          },
        },
      }}
    />
  );
};
```

## Adding the tooltip

We want to use the `external` [^1] property on the tooltip plugin. We will be checking the tooltip opacity to show and hide our custom tooltip.

```typescript
const LineChart = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  const closeTooltip = () => { setIsTooltipOpen(false) }
  const openTooltip = () => { setIsTooltipOpen(true) }

  return (
    <Line
      data={FAKE_DATA}
      options={{
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          tooltip: {
            enabled: false,
            external: ({ tooltip }) => {
              if (tooltip.opacity === 0 && isTooltipOpen) {
                closeTooltip()
                return
              }

              openTooltip()
            }
          },
        },
      }}
    />
    {isTooltipOpen && <CustomTooltip />}
  )
}
```

Now that the tooltip is displayed, we only need to pass it data.

First, we explicit the type of the data:

```typescript
import { TooltipItem } from "chart.js";

type TooltipData = {
  dataPoints: TooltipItem<"line">[];
};
```

Then, we can update the data and pass it to our custom tooltip:

```typescript
const LineChart = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [data, setData] = useState<TooltipData>({ dataPoints: [] });

  const resetData = () => {
    setData({ dataPoints: [] });
  };
  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };
  const openTooltip = () => {
    setIsTooltipOpen(true);
  };

  return (
    <Box>
      <Line
        data={FAKE_DATA}
        options={{
          interaction: {
            intersect: false,
            mode: "index",
          },
          plugins: {
            tooltip: {
              enabled: false,
              external: ({ tooltip }) => {
                if (tooltip.opacity === 0 && isTooltipOpen) {
                  resetData();
                  closeTooltip();
                  return;
                }

                const newData = {
                  dataPoints: tooltip.dataPoints,
                };

                setData(newData);
                openTooltip();
              },
            },
          },
        }}
      />
      {isTooltipOpen && <CustomTooltip {...data} />}
    </Box>
  );
};
```

The custom tooltip displays a box of color per data point next to their values.

```typescript
const CustomTooltip = (data: TooltipData) => (
  <Tooltip
    isOpen={true}
    label={
      <Box>
        {data.dataPoints.map((point) => (
          <Flex gridGap="1rem" key={`${point.datasetIndex}-${point.dataIndex}`}>
            <Box
              backgroundColor={point.dataset.borderColor as string}
              boxSize="1rem"
            />
            {point.formattedValue}
          </Flex>
        ))}
      </Box>
    }
    hasArrow
    placement="right"
  >
    <Box boxSize="1rem" />
  </Tooltip>
);
```

And here it is! The tooltip displays when hovering the graph.

{{< video caption="Hovering the line chart displays external tooltip" src="/chartjs/external-tooltip/show_tooltip.webm" >}}

## Placing the tooltip on the chart

Right now, the tooltip is under the chart. Ideally, we want it to be on the chart where the tooltip is supposed to be.

For that, our custom tooltip will be in `position: absolute` and its parent will be `position: relative`.

```typescript
const LineChart = () => {
  ...
  return (
    <Box position="relative">
      <Line
        ...
      />
      {isTooltipOpen && <CustomTooltip {...data} />}
    </Box>
  )
}
```

```typescript
const CustomTooltip = (data: TooltipData) => (
  <Tooltip
    ...
  >
    <Box boxSize="1rem" position="absolute" top="35%" left={data.left} />
  </Tooltip>
);
```

Previously, we set `top: 35%` on `CustomTooltip` and `left` properties. `left` depends on the tooltip position.

```typescript
const LineChart = () => {
  ...
  return (
    <Box position="relative">
      <Line
        data={FAKE_DATA}
        options={{
          interaction: {
            intersect: false,
            mode: "index",
          },
          plugins: {
            tooltip: {
              enabled: false,
              external: ({ tooltip }) => {
                if (tooltip.opacity === 0 && isTooltipOpen) {
                  resetData()
                  closeTooltip()
                  return
                }

                const newData = {
                  dataPoints: tooltip.dataPoints,
                  left: tooltip.caretX // use caretX value instead of x
                }

                setData(newData)
                openTooltip()
              }
            },
          },
        }}
      />
      {isTooltipOpen && <CustomTooltip {...data} />}
    </Box>
  )
}
```

`TooltipData` type is modified accordingly.

```typescript
type TooltipData = {
  dataPoints: TooltipItem<"line">[];
  left: number;
};
```

{{< video caption="Tooltip displays at the proper location" src="/chartjs/external-tooltip/place_tooltip.webm" >}}

## Optimize rendering

It works well. All that is left is improving the render.

Right now, it's rerendering way too much due to how the `external` callback works. A quick way to check that is to add a simple state to count how many times the `external` callback is called.

```typescript
  ...
  external: ({ tooltip }) => {
    if (tooltip.opacity === 0 && isTooltipOpen) {
      resetData()
      closeTooltip()
      return
    }

    const newData = {
      dataPoints: tooltip.dataPoints,
      left: tooltip.caretX
    }

    setData(newData)
    openTooltip()
    increaseCounter()
  }
  ...
```

{{< video caption="Before comparison: Counter displays rerender" src="/chartjs/external-tooltip/pre_rendering_optimization.webm" >}}

An easy way to fix that is to update the data only when the new data is different from the previous one.

In this case, we only check if `data.left` is different from `newData.left` but sometimes you need to compare the rest of the data for a better comparison.

```typescript
const arePositionsDifferent = (d1: TooltipData, d2: TooltipData) =>
  d1.left !== d2.left;
```

```typescript
  ...
  external: ({ tooltip }) => {
    if (tooltip.opacity === 0 && isTooltipOpen) {
      resetData()
      closeTooltip()
      return
    }

    const newData = {
      dataPoints: tooltip.dataPoints,
      left: tooltip.caretX
    }

    if (arePositionsDifferent(data, newData)) {
      setData(newData)
      openTooltip()
      increaseCounter()
    }
  }
  ...
```

Here is the result:

{{< video caption="After comparison: Counter displays rerender" src="/chartjs/external-tooltip/post_rendering_optimization.webm" >}}

## Final code

<details>

<summary>Here is the final code resulting from this post.</summary>

`FAKE_DATA` can be found in [this repository](https://github.com/ShaigroRB/external-tooltip-chartjs-react-chakra/blob/main/src/utils.ts).

```typescript
import { Box, Flex, Tooltip } from "@chakra-ui/react";
import {
  CategoryScale,
  Chart,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  TooltipItem,
} from "chart.js";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { FAKE_DATA } from "./utils";

Chart.register([
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTooltip,
]);

export const App = () => <LineChart />;

type TooltipData = {
  dataPoints: TooltipItem<"line">[];
  left: number;
};

const LineChart = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [data, setData] = useState<TooltipData>({ dataPoints: [], left: -1 });

  const resetData = () => {
    setData({ dataPoints: [], left: -1 });
  };
  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };
  const openTooltip = () => {
    setIsTooltipOpen(true);
  };

  return (
    <Box position="relative">
      <Line
        data={FAKE_DATA}
        options={{
          interaction: {
            intersect: false,
            mode: "index",
          },
          plugins: {
            tooltip: {
              enabled: false,
              external: ({ tooltip }) => {
                if (tooltip.opacity === 0 && isTooltipOpen) {
                  resetData();
                  closeTooltip();
                  return;
                }

                const newData = {
                  dataPoints: tooltip.dataPoints,
                  left: tooltip.caretX,
                };

                if (arePositionsDifferent(data, newData)) {
                  setData(newData);
                  openTooltip();
                }
              },
            },
          },
        }}
      />
      {isTooltipOpen && <CustomTooltip {...data} />}
    </Box>
  );
};

const arePositionsDifferent = (d1: TooltipData, d2: TooltipData) =>
  d1.left !== d2.left;

const CustomTooltip = (data: TooltipData) => (
  <Tooltip
    isOpen={true}
    label={
      <Box>
        {data.dataPoints.map((point) => (
          <Flex gridGap="1rem" key={`${point.datasetIndex}-${point.dataIndex}`}>
            <Box
              backgroundColor={point.dataset.borderColor as string}
              boxSize="1rem"
            />
            {point.formattedValue}
          </Flex>
        ))}
      </Box>
    }
    hasArrow
    placement="right"
  >
    <Box boxSize="1rem" position="absolute" top="35%" left={data.left} />
  </Tooltip>
);
```

</details>

You can also find an example in [**this repository**](https://github.com/ShaigroRB/external-tooltip-chartjs-react-chakra).

## Documentation & tutorials

If you want to learn more about ChartJS, I recommend checking out:

1. [The documentation of ChartJS](https://www.chartjs.org/docs/). It is a great documentation, well written and mostly complete.
2. [@ChartJS-tutorials](https://www.youtube.com/@ChartJS-tutorials) on YouTube. The videos are well done and cover a lot of subjects.

[^1]: [ChartJS - External tooltip](https://www.chartjs.org/docs/latest/configuration/tooltip.html#external-custom-tooltips)
