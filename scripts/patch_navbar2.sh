#!/bin/bash
# Recreate the Navbar bottom cleanly
sed -i '/{\/\* Role Explanation Modal \*\//,$d' src/components/Navbar.tsx
echo "    </header>" >> src/components/Navbar.tsx
echo "  );" >> src/components/Navbar.tsx
echo "};" >> src/components/Navbar.tsx
