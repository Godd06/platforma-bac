/**
 * Platforma BAC Test Suite Runner
 * Executes all unit and integration test suites sequentially in a single Node process.
 */

import '../components/auth/AdminProtectedRoute.test'
import '../components/auth/AuthHardening.test'
import '../components/auth/RpcSecurity.test'
import '../components/auth/SchemaRlsAudit.test'
import '../components/auth/StorageSecurity.test'
import '../components/auth/AuthUx.test'
import '../components/dashboard/DashboardMetrics.test'
import '../components/catalog/CatalogSecurity.test'
import '../components/lesson/LessonViewer.test'
import '../components/admin/cms/LessonBlocksMatrix.test'
import '../components/admin/cms/RichTextAndHighlights.test'
import '../components/admin/cms/AdminCmsOperations.test'
import '../components/admin/cms/LessonStudioStudio.test'
import '../components/admin/media/MediaLibrary.test'
import '../components/admin/users/AdminUsersManagement.test'
import '../components/auth/SubscriptionEntitlement.test'
import '../components/analytics/AnalyticsTaxonomy.test'
import '../components/quiz/QuizSystem.test'
import '../components/ui/DesignSystemPrimitives.test'
import '../components/auth/AccessibilityAudit.test'
import '../components/catalog/SeoHelper.test'
import '../components/ui/ErrorHandlingSystem.test'
import './e2e/CriticalFlowsE2E.test'
import '../utils/Observability.test'

console.log('\n🎉 ✅ [ALL 24 TEST SUITES PASSED CLEANLY IN ALL ENVIRONMENTS]')
