'use client';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

type TDataExportContext = {
  data: unknown[] | null;
  setData(data: unknown[] | null, exportType?: 'excel' | 'pdf'): void;
  exportType?: 'excel' | 'pdf';
};

const DataExportContext = createContext<TDataExportContext>({
  data: null,
  setData() {},
});

export const useDataExportContext = () => {
  const ctx = useContext(DataExportContext);

  if (!ctx)
    throw Error(
      "'useDataExportContext' must be used within a DataExportContextProvider"
    );

  return ctx;
};

export function DataExportProvider({ children }: PropsWithChildren) {
  const [internalData, setInternalData] = useState<unknown[] | null>(null);
  const [exportType, setExportType] = useState<'excel' | 'pdf'>();

  const setData = useCallback(
    (d: unknown[] | null, _exportType?: 'excel' | 'pdf') => {
      setInternalData(d);
      setExportType(_exportType);
      console.log(d);
      console.log({ _exportType });
    },
    []
  );

  return (
    <DataExportContext.Provider
      value={{ data: internalData, setData, exportType }}
    >
      {children}
    </DataExportContext.Provider>
  );
}
