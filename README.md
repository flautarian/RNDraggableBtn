# DraggableButton Component

The `DraggableButton` is a customizable React Native component that allows users to drag and drop a button within a defined area. It supports animations, gesture handling, and configurable behavior for drag-and-drop interactions.

## Installation

To use this component, ensure you have the following dependencies installed:

- `react-native-reanimated`
- `react-native-gesture-handler`

Install them using:

```bash
npm install react-native-reanimated react-native-gesture-handler
```

## Props

| Prop Name         | Type       | Default Value       | Description                                                                 |
|--------------------|------------|---------------------|-----------------------------------------------------------------------------|
| `onArrangeEnd`     | `function` | `null`              | Callback triggered when the drag ends. Receives the final `x` and `y` positions. |
| `onArrangeInit`    | `function` | `null`              | Callback triggered when the drag starts.                                   |
| `gesture`          | `object`   | `null`              | Gesture object for handling tap gestures.                                  |
| `returnMode`       | `string`   | `"initial-position"`| Determines the button's return behavior after drag. Options: `initial-position`, `none`, `closest-axis-x`, `closest-axis-y`, `closest-axis`. |
| `initialPosition`  | `object`   | `{ x: 0, y: 0 }`    | Initial position of the button. Must include `x` and `y` values.           |
| `children`         | `node`     | `null`              | Content to render inside the draggable button.                             |
| `scaleCustomConfig`         | `object`     | `null`              | Custom spring animation config object to customize the scale of the button when animation is enabled. More info in reanimated config section.                             |
| `dragCustomConfig`         | `object`     | `null`              | Custom spring animation config object to customize the drag animation when button is begin dragged. More info in reanimated config section.                             |
| `returnCustomConfig`         | `object`     | `null`              | Custom spring animation config object to customize the return animation when button is returning to the original position if is configured to return to. More info in reanimated config section.                             |
| `canMove`          | `boolean`  | `true`              | Enables or disables drag functionality.                                    |
| `blockDragX`       | `boolean`  | `false`             | Prevents movement along the X-axis.                                        |
| `blockDragY`       | `boolean`  | `false`             | Prevents movement along the Y-axis.                                        |
| `animateButton`    | `boolean`  | `false`             | Enables scaling animation during drag.                                     |
| `maxDistance`      | `number`   | `0`                 | Maximum distance the button can move from its initial position.            |
| `minDistance`      | `number`   | `0`                 | Minimum distance required to trigger the `onArrangeEnd` callback.          |
| `style`            | `object`   | `{}`                | Custom styles for the button.                                              |

## Usage

### Basic Example

```jsx
import React from 'react';
import { DraggableButton } from './DraggableButton';
import { Text } from 'react-native';

const App = () => {
  return (
    <DraggableButton
      initialPosition={{ x: 50, y: 100 }}
      onArrangeEnd={(x, y) => console.log(`Dragged to: ${x}, ${y}`)}
    >
      <Text>Drag Me</Text>
    </DraggableButton>
  );
};

export default App;
```

### Advanced Example

```jsx
import { Dimensions, Text, View } from 'react-native';
import { DraggableButton } from 'react-native-draggable-button';

export default function App() {

  const { height, width } = Dimensions.get('window');

  const customDragConfig = {
    duration: 1500,
    dampingRatio: 0.7,
    stiffness: 100,
  };
  return (
    <View style={{ flex: 1 }}>
      <DraggableButton
        style={{ width: 50, height: 50, backgroundColor: 'red', borderRadius: 50, textAlign: 'center', flex: 1, cursor: 'pointer' }}
        initialPosition={{ x: width / 2, y: height / 2 }}
        returnMode='initial-position'
        dragCustomConfig={customDragConfig}
        returnCustomSpringConfig={customDragConfig}
        scaleCustomConfig={customDragConfig}
        animateButton={true}
        onArrangeInit={() => {
          console.log('Drag started');
        }}
        onArrangeEnd={(x, y) => {
          console.log('Dragging at:', x, y);
        }}>
        <Text selectable={false} style={{ fontSize: 30, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>😊</Text>
      </DraggableButton>
    </View>
  );
}
```

### Example with Return Modes

```jsx
<DraggableButton
  initialPosition={{ x: 100, y: 200 }}
  returnMode="closest-axis"
  maxDistance={150}
  animateButton={true}
  onArrangeEnd={(x, y) => console.log(`Dropped at: ${x}, ${y}`)}
>
  <Text>Drag Me</Text>
</DraggableButton>
```

### Example with Custom spring animation config on drag button

```jsx

const dragCustomSpringConfig = dragCustomConfig || {
    duration: 1500,
    dampingRatio: 0.5,
    stiffness: 100,
  };

<DraggableButton
  initialPosition={{ x: 100, y: 200 }}
  dragCustomConfig={dragCustomSpringConfig}
  returnMode="closest-axis"
  maxDistance={150}
  animateButton={true}
  onArrangeEnd={(x, y) => console.log(`Dropped at: ${x}, ${y}`)}
>
  <Text>Drag Me</Text>
</DraggableButton>
```

### Example with Gesture Handling

```jsx
import { Gesture } from 'react-native-gesture-handler';

const tapGesture = Gesture.Tap().onEnd(() => console.log('Tapped!'));

<DraggableButton
  initialPosition={{ x: 0, y: 0 }}
  gesture={tapGesture}
>
  <Text>Tap or Drag Me</Text>
</DraggableButton>
```

## Return Modes

- **`initial-position`**: Returns to the initial position after drag.


- **`none`**: Stays at the dropped position.


- **`closest-axis-x`**: Snaps to the closest horizontal edge.


- **`closest-axis-y`**: Snaps to the closest vertical edge.


- **`closest-axis`**: Snaps to the closest edge.



## Notes

- Ensure the `initialPosition` prop is within the screen bounds.
- Use `maxDistance` and `minDistance` to control drag limits and trigger conditions.
- For gesture handling, wrap the component with `GestureHandlerRootView`.

## License

This component is open-source and available under the MIT License.  