import { DockviewReact, GridviewReact, PaneviewReact } from "dockview";
import { useRef } from "react";
import { Editor } from "./Editor";
import { FileTree } from "./FileTree";
import { Terminal } from "./Terminal";
import { useStartup } from "../hooks/useStartup";
import * as panels from "../libs/panels";

import type {
  DockviewApi,
  GridviewApi,
  PaneviewApi,
  PanelCollection,
  IGridviewPanelProps,
  IPaneviewPanelProps,
  IDockviewPanelProps,
} from "dockview";
import type { FileSystemAPI } from "@webcontainer/api";
import type { ShellInstance } from "../hooks/useShell";
import type { CollabInstance } from "../hooks/useCollab";

const AppRoot = () => {
  const grid = useRef<GridviewApi>();
  const dock = useRef<DockviewApi>();
  const panes = useRef<PaneviewApi>();

  useStartup(grid, dock, panes);

  return (
    <GridviewReact
      className={"dockview-theme-dark"}
      components={gridComponents}
      proportionalLayout={false}
      onReady={(event) => {
        grid.current = event.api;
        panels.openDock(event.api, dock);
        panels.openPanes(event.api, panes);
      }}
    />
  );
};

const dockComponents: PanelCollection<IDockviewPanelProps> = {
  editor: (
    props: IDockviewPanelProps<{
      fs: FileSystemAPI;
      path: string;
      sync: CollabInstance;
    }>,
  ) => (
    <Editor
      fs={props.params.fs}
      path={props.params.path}
      sync={props.params.sync}
    />
  ),
  preview: (props: IDockviewPanelProps<{ url: string }>) => (
    <iframe
      src={props.params.url}
      allow="cross-origin-isolated"
      // @ts-expect-error: credentialless has partial browser support
      // eslint-disable-next-line react/no-unknown-property
      credentialless
    />
  ),
};

const gridComponents: PanelCollection<IGridviewPanelProps> = {
  dock: (
    props: IGridviewPanelProps<{ api: React.MutableRefObject<DockviewApi> }>,
  ) => (
    <DockviewReact
      components={dockComponents}
      onReady={(event) => {
        props.params.api.current = event.api;
      }}
    />
  ),
  panes: (
    props: IGridviewPanelProps<{ api: React.MutableRefObject<PaneviewApi> }>,
  ) => (
    <PaneviewReact
      components={paneComponents}
      onReady={(event) => {
        props.params.api.current = event.api;
      }}
    />
  ),
  terminal: (
    props: IGridviewPanelProps<{ dock: DockviewApi; shell: ShellInstance }>,
  ) => (
    <Terminal
      shell={props.params.shell}
      panelApi={props.api}
      onServerReady={panels.createPreviewOpener(props.params.dock)}
    />
  ),
};

const paneComponents: PanelCollection<IPaneviewPanelProps> = {
  filetree: (
    props: IPaneviewPanelProps<{
      dock: DockviewApi;
      fs: FileSystemAPI;
      sync: CollabInstance;
    }>,
  ) => (
    <FileTree
      fs={props.params.fs}
      onRenameItem={panels.createFileRenameHandler(
        props.params.dock,
        props.params.fs,
      )}
      onTriggerItem={panels.createFileOpener(
        props.params.dock,
        props.params.fs,
        props.params.sync,
      )}
    />
  ),
};

export default AppRoot;