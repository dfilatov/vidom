webpack --config playground/webpack.config.js --optimize-minimize
git clone -b gh-pages git@github.com:dfilatov/vidom.git gh-pages
cp -r playground/{index,out}.html playground/index.bundle.js gh-pages/playground
cd gh-pages
git add -A
git commit -m "gh-pages updated"
git push origin gh-pages
cd ..
rm -rf gh-pages playground/index.bundle.js
