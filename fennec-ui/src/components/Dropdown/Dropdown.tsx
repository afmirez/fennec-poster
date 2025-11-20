import { IconKey } from "@/types/icon-keys.type";
import IconButton from "../IconButton/IconButton";
import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  icon: IconKey;
  options: string[];
  defaultOption?: string | null;
  onChange?: (value: string) => void;
}

const Dropdown = ({
  icon,
  options,
  defaultOption = null,
  onChange,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    defaultOption
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (key: string) => {
    if (key !== selectedOption) {
      setSelectedOption(key);
      onChange?.(key);
      setIsOpen((prevIsOpen) => !prevIsOpen);
    }
  };

  return (
    <div className={styles.dropdown}>
      <IconButton
        iconKey={icon}
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
      />
      <div
        ref={dropdownRef}
        className={`${styles.dropdownContent} ${isOpen ? styles.show : ""}`}
      >
        {options.map((el) => (
          <button
            key={el}
            className={styles.contentButton}
            onClick={() => handleOptionClick(el)}
          >
            {el}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
