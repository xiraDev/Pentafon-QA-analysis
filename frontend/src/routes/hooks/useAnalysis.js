import { useState } from 'react';

import axios from 'src/utils/axios';

import promptAdapter from 'src/adapters/promptAdapter.adapter';

import { toast } from 'src/components/snackbar';

const useAnalysis = (data) => {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);

  const handleSendAnalysis = async () => {
    const eligibleConversations = data.filter((convo) => convo.messages.length > 5 && !convo.analysisResult);
    const randomConversations = eligibleConversations.sort(() => 0.5 - Math.random()).slice(0, 5);

    try {
      const response = await axios.post('/api/v1/analysis/text', { conversations: randomConversations });
      // setAnalysisResults(response.data.meta);
      // setIsAnalysisDialogOpen(true);
    } catch (err) {
      console.error('Error enviando análisis:', err);
      toast.error('Error enviando análisis');
    }
  };

  return {
    analysisResults,
    isAnalysisDialogOpen,
    setIsAnalysisDialogOpen,
    handleSendAnalysis,
    promptAdapter,
    setAnalysisResults,
  };
};

export default useAnalysis;
