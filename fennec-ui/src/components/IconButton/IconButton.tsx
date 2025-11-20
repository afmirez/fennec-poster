import iconMap from "@/components/icons/icon-map";
import styles from "./styles.module.css";

type IconButtonProps = {
  iconKey: keyof typeof iconMap;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  iconProps?: React.SVGProps<SVGSVGElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton = ({
  iconKey,
  iconProps,
  ...buttonProps
}: IconButtonProps) => {
  const Icon = iconMap[iconKey];
  return (
    <button className={styles.iconButton} {...buttonProps}>
      <Icon {...iconProps} />
    </button>
  );
};

export default IconButton;
