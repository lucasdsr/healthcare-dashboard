import { useState, useCallback } from 'react';
import { usePatientSearch } from '@/infrastructure/queries/encounter-queries';
import { PatientSearchResult } from '@/shared/types/filters';

export const usePatientSearchLogic = (initialPatientQuery: string = '') => {
  const [patientSearchQuery, setPatientSearchQuery] =
    useState(initialPatientQuery);
  const [showPatientResults, setShowPatientResults] = useState(false);

  const { data: patientSearchResults, isLoading: isSearching } =
    usePatientSearch(patientSearchQuery);

  const formatPatientResults = useCallback((): PatientSearchResult[] => {
    if (!patientSearchResults) return [];

    return patientSearchResults.map(patient => ({
      id: patient.id,
      label: patient.name?.[0]?.text || `Patient ${patient.id}`,
      subtitle: `ID: ${patient.id}`,
    }));
  }, [patientSearchResults]);

  const handlePatientSelect = useCallback((result: PatientSearchResult) => {
    setPatientSearchQuery(result.label);
    setShowPatientResults(false);
    return result.id;
  }, []);

  const handlePatientQueryChange = useCallback((value: string) => {
    setPatientSearchQuery(value);
    if (value) {
      setShowPatientResults(true);
    } else {
      setShowPatientResults(false);
    }
  }, []);

  return {
    patientSearchQuery,
    showPatientResults,
    isSearching,
    patientSearchResults: formatPatientResults(),
    handlePatientQueryChange,
    handlePatientSelect,
    setShowPatientResults,
  };
};
