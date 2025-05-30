import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';

export function createAnalysisRoutes(analysisController: AnalysisController): Router {
  const router = Router();

  // POST /api/v1/git/analyze - Start repository analysis
  router.post('/analyze', async (req, res) => {
    await analysisController.analyzeRepository(req, res);
  });

  // GET /api/v1/git/analysis/:repoId - Get analysis status and results
  router.get('/analysis/:repoId', async (req, res) => {
    await analysisController.getAnalysis(req, res);
  });

  // GET /api/v1/git/analyses - List user's analyses
  router.get('/analyses', async (req, res) => {
    await analysisController.listAnalyses(req, res);
  });

  // DELETE /api/v1/git/analysis/:repoId - Delete analysis
  router.delete('/analysis/:repoId', async (req, res) => {
    await analysisController.deleteAnalysis(req, res);
  });

  return router;
}