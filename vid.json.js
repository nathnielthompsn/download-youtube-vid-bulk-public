const elements = Array.from(document.querySelectorAll('ytd-app > div#content.style-scope.ytd-app > ytd-page-manager#page-manager.style-scope.ytd-app > ytd-browse.style-scope.ytd-page-manager > ytd-two-column-browse-results-renderer.style-scope.ytd-browse.grid.grid-5-columns > div#primary.style-scope.ytd-two-column-browse-results-renderer > ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer > div#contents.style-scope.ytd-rich-grid-renderer > ytd-rich-grid-row.style-scope.ytd-rich-grid-renderer > div#contents.style-scope.ytd-rich-grid-row > ytd-rich-item-renderer.style-scope.ytd-rich-grid-row > div#content.style-scope.ytd-rich-item-renderer > ytd-rich-grid-slim-media.style-scope.ytd-rich-item-renderer > div#dismissible > ytd-thumbnail > a#thumbnail'));
const data = [];
elements.forEach((element, index) => {
  const title = `video-${index + 1}`;
  const url = element.href;
  data.push({ title, url });
});
const jsonData = JSON.stringify(data, null, 2);
const blob = new Blob([jsonData], { type: 'application/json' });
const downloadLink = document.createElement('a');
downloadLink.href = URL.createObjectURL(blob);
downloadLink.download = 'vid.json';
downloadLink.click();