fetch('./components/disclaimer/template.html')
	.then((response) => {
		return response.text();
	})
	.then((data) => {
		document.querySelector('disclaimer').innerHTML = data;
	});
