import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DraggableContainer } from '../src/components/DraggableButton';
import { Text } from 'react-native';

// Mock the onSelect and onDelete functions
const mockOnSelect = jest.fn();
const mockOnDelete = jest.fn();

describe('DragableContainer', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <DraggableContainer
        x={0}
        y={0}
        height={100}
        width={100}
        rotation={0}
        resizeMode="1-square"
        index={0}
        selected={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      >
        <Text testID="child">Child Component</Text>
      </DraggableContainer>
    );

    // Check if the child component is rendered
    expect(getByTestId('child')).toBeTruthy();
  });

  it('calls onSelect when pressed', () => {
    const { getByText } = render(
      <DraggableContainer
        x={0}
        y={0}
        height={100}
        width={100}
        rotation={0}
        resizeMode="1-square"
        index={0}
        selected={false}
        onSelect={mockOnSelect}
        onDelete={mockOnDelete}
      >
        <Text> Test </Text>
      </DraggableContainer>
    );

    // Simulate a press event
    fireEvent.press(getByText('Test'));

    // Check if onSelect was called
    expect(mockOnSelect).toHaveBeenCalledWith(0);
  });

});
