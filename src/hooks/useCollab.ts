import { useRef, useCallback, useEffect } from "react";

import type { ShellInstance } from "./useShell";
import type { Editor } from "../libs/monaco";
import type * as YJS from "../libs/yjs";

export interface CollabInstance {
  session: React.MutableRefObject<YJS.Session | null>;
  syncEditor: (editor: Editor) => void;
}

export function useCollab(shell: ShellInstance): CollabInstance {
  const init = useRef(false);
  const session = useRef<YJS.Session | null>(null);
  const syncMonaco = useRef<typeof YJS.monaco | null>(null);
  const syncEditor = useCallback((editor: Editor) => {
    if (!session.current || !syncMonaco.current) return;
    console.log("Index sync enabled.");
    syncMonaco.current(
      editor,
      session.current.document,
      session.current.provider,
    );
  }, []);

  useEffect(() => {
    if (init.current) return;
    if (shell?.container?.fs) {
      init.current = true;
      const syncKey = location.hash;
      if (!syncKey) return;
      console.log("Setting up sync using key:", syncKey);
      // Import sync module & connect
      import("../libs/yjs").then((sync) => {
        session.current = sync.connect(syncKey);
        syncMonaco.current = sync.monaco;
        console.log("Connected to sync.");
      });
    }
  }, [shell]);

  return { session, syncEditor };
}
