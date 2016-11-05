import page from 'page';
import header from '../header';
import title from 'title';
import empty from 'empty-element';
import template from './template';

page('/:username', header, loadUSer, function (ctx, next) {
	var main = document.getElementById('main-container');
	title(`Mazcoti - ${ctx.params.username}`);
	empty(main).appendChild(template(ctx.user));
	$('.materialboxed').materialbox();
});

page('/:username/:id', header, loadUSer, function (ctx, next) {
	var main = document.getElementById('main-container');
	title(`Mazcoti - ${ctx.params.username}`);
	empty(main).appendChild(template(ctx.user));
	// $(`#modal${ctx.params.id}`).openModal({
	// 	complete: function () {
	// 		const path = `/${ctx.params.username}`;
	// 		page(path)
	// 	}
	// });
	$('.materialboxed').materialbox();
});

async function loadUSer (ctx, next) {
	try {
		ctx.user = await fetch(`/api/user/${ctx.params.username}`).then(res => res.json())
		next()
	} catch (err) {
		console.log(err)
	}
}