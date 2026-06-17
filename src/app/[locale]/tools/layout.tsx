import { ToolsLayoutShell } from "@/components/tools/ToolsLayoutShell";

type Props = {
  children: React.ReactNode;
};

/** Alt sayfalarda site navbar gizlenir; ToolChrome üst çubuk + mobil menü */
export default function ToolsLayout({ children }: Props) {
  return <ToolsLayoutShell>{children}</ToolsLayoutShell>;
}
