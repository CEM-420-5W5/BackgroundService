import { cn } from "../lib/utils";

export interface BorderedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function BorderedContainer({ children, className, ...props }: BorderedContainerProps) {

    return(
        <div
            className={cn(
            "border border-slate-700 rounded-lg p-6 bg-white dark:border-slate-800 dark:bg-slate-950",
            "",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
}