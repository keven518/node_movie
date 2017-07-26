$(function(){
	$('.del').click(function(e) {
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);
		console.log(id);
		console.log(tr);
		tr.remove();

		$.ajax({
			type: 'DELETE',
			url: '/admin/list?id=' + id
		})
		.done(function(results) {
			console.log(results);
			if (results.success === 1) {
				if (tr.length > 0) {
					tr.remove();
				}
			}
		})

	})
		$('#douban').blur(function() {
			var douban = $(this);
			var id = douban.val();
			console.log('id: ');
			console.log(id);

			if (id) {
				$.ajax({
					url: 'https://api.douban.com/v2/movie/subject/' + id,
					cache: true,
					type: 'get',
					dataType: 'jsonp',
					crossDomain: true,
					jsonp: 'callback',
					success: function(data) {
						$('#inputTitle').val(data.title);
						$('#inputDirector').val(data.directors[0].name);
						$('#inputCountry').val(data.countries[0]);
						$('#inputLanguage').val(data.images.large);
						$('#inputYear').val(data.year);
						$('#inputSummary').val(data.summary);
						$('#inputPoster').val(data.images.large);
					}
				})
			}

		})
})