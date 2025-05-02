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
| `returnMode`       | `string`   | `"initial-position"`| Determines the button's return behavior after drag. Options: `initial-position`, `none`, `closest-axis-x`, `closest-axis-y`. |
| `initialPosition`  | `object`   | `{ x: 0, y: 0 }`    | Initial position of the button. Must include `x` and `y` values.           |
| `children`         | `node`     | `null`              | Content to render inside the draggable button.                             |
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

## Notes

- Ensure the `initialPosition` prop is within the screen bounds.
- Use `maxDistance` and `minDistance` to control drag limits and trigger conditions.
- For gesture handling, wrap the component with `GestureHandlerRootView`.

## License

This component is open-source and available under the MIT License.  