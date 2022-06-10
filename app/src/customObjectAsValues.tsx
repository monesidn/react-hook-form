import React from 'react';
import { Controller, useForm } from 'react-hook-form';

export class FancyColor {
  constructor(private _name: string, public cssString: string) {}

    get name(){
        return this._name;
    }

  getTileComponent() {
    return (
      <div
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          backgroundColor: this.cssString,
        }}
      ></div>
    );
  }
}

interface FancyColorSelectorProps {
  options: FancyColor[];

  value: FancyColor | undefined;

  onChange: (value: FancyColor) => void;
}

const FancyColorSelector = (props: FancyColorSelectorProps) => {
  return (
    <>
      {props.value && (
        <div>
          Currently selected: {props.value.getTileComponent()}{' '}
          {props.value.name}
        </div>
      )}
      {props.options
        .filter((i) => i !== props.value)
        .map((color) => {
          return (
            <button key={color.name} role="button" onClick={() => props.onChange(color)}>{color.name}</button>
          );
        })}
    </>
  );
};

export interface FormModel {
  color?: FancyColor;
}

const options = [
  new FancyColor('red', '#FF0000'),
  new FancyColor('green', '#00FF00'),
  new FancyColor('blue', '#0000FF'),
  new FancyColor('gray', 'gray'),
];

const CustomObjectAsValues: React.FC = () => {
  const { control } = useForm<FormModel>({
    defaultValues: {
        color: options[0]
    },
  });

  return (
    <>
      {/* <form> */}
        <Controller
          control={control as any}
          name={'color'}
          render={({ field }) => (
            <FancyColorSelector {...field} options={options} />
          )}
        />
      {/* </form> */}
    </>
  );
};

export default CustomObjectAsValues;
