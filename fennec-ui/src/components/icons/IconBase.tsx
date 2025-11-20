type IconBaseProps = React.SVGProps<SVGSVGElement> & {
  children: React.ReactNode;
};

export default function IconBase({ children, ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="24"
      height="24"
      {...props}
    >
      {children}
    </svg>
  );
}
