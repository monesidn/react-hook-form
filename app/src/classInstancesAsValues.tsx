import React, { forwardRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

class FancyColor {
  constructor(
    public cssName: string,
    public textColor: string,
    public rgb: string,
  ) {}

  getTileComponent() {
    return (
      <div
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          backgroundColor: this.rgb,
        }}
      ></div>
    );
  }
}

const colors = [
  new FancyColor('AliceBlue', 'black', '#F0F8FF'),
  new FancyColor('Aquamarine', 'black', '#7FFFD4'),
  new FancyColor('Black', 'white', '#000000'),
  new FancyColor('Brown', 'white', '#A52A2A'),
  new FancyColor('CadetBlue', 'white', '#5F9EA0'),
  new FancyColor('DarkMagenta', 'white', '#8B008B'),
  new FancyColor('FloralWhite', 'black', '#FFFAF0'),
  new FancyColor('White', 'black', '#FFFFFF'),
];

interface FancyColorSelectorProps {
  options: FancyColor[];

  value: FancyColor | undefined;

  onChange: (value: FancyColor) => void;
}

const FancyColorSelector = forwardRef<
  HTMLInputElement,
  FancyColorSelectorProps
>((props, ref) => {
  return (
    <>
      <input value={props.value?.rgb || ''} type="hidden" ref={ref} />
      <div>Please pick a color</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {props.options
          .filter((i) => i !== props.value)
          .map((color) => (
            <div
              key={color.cssName}
              style={{
                padding: '8px',
                backgroundColor: color.rgb,
                color: color.textColor,
                cursor: 'pointer',
                borderRadius: '4px',
              }}
              onClick={() => props.onChange(color)}
            >
              {color.cssName === props.value?.cssName && <>&gt;</>}
              {color.cssName}
            </div>
          ))}
      </div>
    </>
  );
});

export interface FormModel {
  color?: FancyColor;
}

const ClassInstancesAsValues: React.FC = () => {
  const [submitted, setSubmitted] = useState<FancyColor[]>([]);
  const { control, handleSubmit } = useForm<FormModel>({
    defaultValues: {},
  });

  return (
    <>
      <form
        onSubmit={handleSubmit((model) => {
          if (model.color) setSubmitted([...submitted, model.color]);
        })}
      >
        <Controller
          control={control as any}
          name={'color'}
          render={({ field }) => (
            <FancyColorSelector {...field} options={colors} />
          )}
        />
        <button role="submit">Submit</button>
      </form>
      <hr />
      <div>
        {!submitted.length ? (
          <>No color selected yet</>
        ) : (
          <>
            Submitted colors:
            <ul>
              {submitted.map((s, i) => (
                <li key={i}>
                  {s.getTileComponent()}
                  &nbsp;
                  {s.cssName}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default ClassInstancesAsValues;
