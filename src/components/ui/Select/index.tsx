import styles from "./Select.module.scss";

type Option = {
  label: string;
  value: string;
  selected?: boolean;
};
type Propstypes = {
  label?: string;
  name: string;
  defaultValue?: string;
  disabled?: boolean;
  options: Option[] | any;
  className?: string;
};
const Select = (props: Propstypes) => {
  const { label, name, defaultValue, disabled, options, className } = props;
  return (
    <div className={`${styles.select} ${className}`}>
      <label htmlFor={name} className={styles.select__label}>
        {label}
      </label>
      <div className={styles.select__container}>
        <select
          name={name}
          id={name}
          defaultValue={defaultValue}
          disabled={disabled}
          className={styles.select__container__input}
        >
          {options.map((option: Option) => (
            <option
              value={option.value}
              key={option.label}
              selected={option.selected}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
