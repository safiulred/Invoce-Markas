function dataTable(selector, options) {
	var responsiveHelper_table_item = undefined;
	var breakpointDefinition = {
		tablet : 1024,
		phone : 480
	};

	$(selector).DataTable().destroy();
	let tableitem = $(selector).removeAttr("width").DataTable({
		processing: true,
		serverSide: true,
		responsive : true,
		searching : options.searching || false,
		scrollY : options.scrollY || 370,
		ajax: options.url,
		columns : options.columns,
		columnDefs : options.columnDefs,
		"sDom": "<'dt-toolbar'<'col-xs-12 col-sm-12'f>r>"+
			"t"+
			"<'dt-toolbar-footer'<'col-sm-5 col-xs-12 hidden-xs'i><'col-sm-2 col-xs-2 hidden-xs'l><'col-xs-5 col-sm-5'p>>",
		"autoWidth" : true,
		fixedColumns: true,
		"pageLength": options.pageLength || 10,
	});

	return tableitem;
}

function rupiah(nStr) {
	nStr += '';
	x = nStr.split(',');
	x1 = x[0];
	x2 = x.length > 1 ? ',' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}