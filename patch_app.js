const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Add useNavigate and useLocation
code = code.replace(
  "import { CV, FilterState, ContactRequest, Company, NotificationItem } from './types';",
  "import { useNavigate, useLocation } from 'react-router-dom';\nimport { CV, FilterState, ContactRequest, Company, NotificationItem } from './types';"
);

// 2. Add hooks to App
code = code.replace(
  "const App: React.FC = () => {",
  "const App: React.FC = () => {\n  const navigate = useNavigate();\n  const location = useLocation();"
);

// 3. handleCVClick
code = code.replace(
  /const handleCVClick = \(cv: CV\) => \{\n\s+setSelectedCV\(cv\);\n\s+\};/g,
  "const handleCVClick = (cv: CV) => {\n    navigate(`/cv/${cv.id}`, { state: { cvData: cv } });\n  };"
);

// 4. handleViewSavedCV
code = code.replace(
  "if (existing) {\n      setSelectedCV(existing);\n      return;\n    }",
  "if (existing) {\n      navigate(`/cv/${existing.id}`, { state: { cvData: existing } });\n      return;\n    }"
);
code = code.replace(
  "if (data) setSelectedCV(data);",
  "if (data) navigate(`/cv/${data.id}`, { state: { cvData: data } });"
);

// 5. handleOpenProfile
code = code.replace(
  "// setSelectedCompanyProfile(data);",
  "navigate(`/company/${data.id}`, { state: { companyData: data } });"
);
code = code.replace(
  "setSelectedCV(data);",
  "navigate(`/cv/${data.id}`, { state: { cvData: data } });"
);

// 6. remove close logic for Job Found
code = code.replace(
  "setSelectedCV(prev => prev ? { ...prev, workingStatus: 'active' } : null);",
  ""
);
code = code.replace(
  "setSelectedCV(null); // Close profile immediately",
  "navigate('/', { replace: true }); // Close profile immediately"
);

// 7. Update bottom nav conditions
code = code.replace(
  "isProfileOpen={isCVPromoOpen || (!!user && !!selectedCV && selectedCV.userId === user.id)}",
  "isProfileOpen={isCVPromoOpen || (!!user && location.pathname.startsWith('/cv/') && location.pathname.split('/')[2] === user.id)} /* TODO: fix accurate check */"
);
code = code.replace(
  "isHomeView={!selectedCV && !isCVFormOpen && !isSettingsOpen && !isCompanyFormOpen && !selectedCompanyProfile && !isNotificationsModalOpen && !isSavedCVsOpen && !isCVPromoOpen}",
  "isHomeView={!location.pathname.startsWith('/cv/') && !location.pathname.startsWith('/company/') && !isCVFormOpen && !isSettingsOpen && !isCompanyFormOpen && !isNotificationsModalOpen && !isSavedCVsOpen && !isCVPromoOpen}"
);

fs.writeFileSync('App.tsx', code);
console.log('App.tsx patched part 1');
