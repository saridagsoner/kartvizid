const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// Update navigate calls to use slug if available
code = code.replace(
  "navigate(`/cv/${existing.id}`",
  "navigate(`/cv/${existing.slug || existing.id}`"
);
code = code.replace(
  "navigate(`/cv/${data.id}`",
  "navigate(`/cv/${data.slug || data.id}`"
);
code = code.replace(
  "navigate(`/cv/${cv.id}`",
  "navigate(`/cv/${cv.slug || cv.id}`"
);
code = code.replace(
  "navigate(`/company/${data.id}`",
  "navigate(`/company/${data.slug || data.id}`"
);
code = code.replace(
  "navigate(`/cv/${data[0].id}`",
  "navigate(`/cv/${data[0].slug || data[0].id}`"
);
code = code.replace(
  "navigate(`/company/${company.id}`",
  "navigate(`/company/${company.slug || company.id}`"
);

// We need a second pass for any other exact matches
code = code.replace(
  "onCompanyClick={(company) => navigate(`/company/${company.id}`",
  "onCompanyClick={(company) => navigate(`/company/${company.slug || company.id}`"
);

// Next: add 'slug' to mapped fields where necessary
code = code.replace(
  "id: item.id,",
  "id: item.id,\n          slug: item.slug,"
);

code = code.replace(
  "userId: item.user_id,",
  "userId: item.user_id,\n          slug: item.slug,"
);
// Above happens twice (cvs and jobFinders) but the "id: item.id," matched will just get replaced multiple times.
// Let's be safe.

fs.writeFileSync('App.tsx', code);
console.log('App.tsx slugs patched');
