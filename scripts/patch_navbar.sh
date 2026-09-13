#!/bin/bash
# Remove Role Modal Trigger (Desktop)
sed -i '/<div className="hidden lg:flex items-center gap-1.5">/,/<\/div>/d' src/components/Navbar.tsx
# Remove Role Modal Implementation
sed -i '/{/\* Role Explanation Modal \*/}/,$d' src/components/Navbar.tsx
echo "    </header>" >> src/components/Navbar.tsx
echo "  );" >> src/components/Navbar.tsx
echo "};" >> src/components/Navbar.tsx
