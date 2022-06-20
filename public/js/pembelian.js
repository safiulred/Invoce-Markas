// LOAD ITEM IN LOCAL STORAGE
function loadTable () {
	if (localStorage.getItem("productsInCart") !== null) {
		console.log('[PARSE ITEM CART]');
		items = JSON.parse(localStorage.getItem("productsInCart"));
	}
	$("#cartTable tbody").html('');
	console.log('[LOAD CART ITEMS] ', items);
	items.forEach(function (x, idx) {
		var rowItems = $('<tr/>' ,{
			'data-id' : idx,
			'data-idsupplier' : x.id_supplier,
			'data-idtag' : x.id_tag,
		});

		console.log('[ITEM] ', x);
		var columnNama = $('<td/>',{
			'data-nama' : x.nama,
			'text' : x.nama,
		});
		var cloumnTipe = $('<td/>',{
			'data-nama' : x.tag,
			'data-id' : x.id_tag,
			'text' : x.tag,
		});
		var columnTebal = $('<td/>',{
			'text' : x.tebal,
		});

		rowItems.append(columnNama);
		rowItems.append(cloumnTipe);
		rowItems.append(columnTebal);
		rowItems.append(`
			<td>
				<input 
					type = 'number' 
					min = '1' 
					class = 'form-control' 
					id = 'hargaBeli'
					data-number = '${idx}'
					onChange = 'hargaChange(this, "${idx}");' 
					onBlur = 'validasiLimit(this.value, "hargaBeli", "${idx}");'/>
			</td>
		`);
		rowItems.append(`
			<td>
				<input 
					min = '1' 
					style = 'width:100px;'
					type = 'number' 
					class = 'form-control'
					data-number = '${idx}'
					id = 'stockInput-${idx}'
					value = '1'
					onChange = 'hargaChange1(this);' 
					onBlur = 'hargaChange1(this);'/>
			</td>
		`);
		rowItems.append(`
			<td 
				id = 'totalHarga' 
				data-number = '${idx}'>
				<input 
					type = 'number' 
					min = '1' 
					class = 'form-control'
					onChange = 'hargaChange2(this, "${idx}")'/>
			</td>
		`);
		rowItems.append(`
			<td align = 'center'>
				<button class = 'btn btn-xs btn-danger' title = 'Delete Item' onClick = 'deleteItem(this, ${idx})'>
					<i class = 'fa fa-times'></i>
				</button>
			</td>`
		);
		$("#cartTable tbody").append(rowItems);
	});
	$('.money').simpleMoneyFormat();
}

function pencarianModal(width) {
	$('div#componentModal1 div#AllModal').html('');
	$('div#componentModal1 .modal-admin').css('width', width);
	$('div#componentModal1 .modal-dialog').css('width', width);
	$('div#componentModal1 div#modal_All').modal('show');
	$('div#componentModal1 div#modal_All div#kosong').html('');
	$('div#componentModal1 div#modal_All h2.modal-title p ').text("Pencarian Barang");
	$('div#componentModal1 div#AllModal').load(`/transaksi/pembelian/viewSearchProduct/${no}`);
}

//- event enter untuk melakukan pencarian barang di transaksi pembelian
function enterYa(e, element) {
	console.log('[ENTER INPUT]');
	if(e.keyCode == 13) {
		if (element.value != "") {
			var arr_item = element.value.split('-');
			console.log(arr_item[1]);
			cariProduct(arr_item[1].trim());
		}
	}
};

function cariProduct(key) {
	$.ajax({
		url : '/transaksi/pembelian/prosesCari',
		type : 'POST',
		data : { kode : key, id_category : '' },
		dataType : 'json',
		success : function (msg) {
			if (msg.status == 200) {
				// console.log('[BARANG] ', msg);
				var datas = msg.data;
				if (datas.length > 0 ) {
					var dataSearch = datas[0];
					chooseProduct(dataSearch);
				}
			} else {
				$.smallBox({
					title : "Peringatan",
					content : `<i class='fa fa-clock-o'></i>${msg.message}<i></i>`,
					color : "#C46A69",
					iconSmall : "fa fa-times  fa-1x fadeInRight animated",
					timeout : 1000
				});
			}
		}
	});
}

function chooseProduct(datas) {
	var selectorTable = $("table#cartTable > tbody > tr[data-id='"+datas._id+"']");
	if (selectorTable.html() == undefined) {
		// console.log('[PUT NEW ITEM IN TABLE]');
		putIntoTable({
			kode_barang : datas.kode,
			barang : datas.nama,
			id_barang : datas._id,
			category : datas.category&&datas.category.nama?datas.category.nama:'',
			id_category : datas.category&&datas.category._id?datas.category._id:'',
			number : no,
		});
	} else {
		// console.log('[UPDATE QTY IN TABLE]');
		let harga_beli = parseInt(selectorTable.find("td").eq(2).find("input").attr('data-harga'));
		if (harga_beli == '') {
			harga_beli = 0;	
		}
		// console.log('[HARGA BELI] ', harga_beli);
		var newStok = selectorTable.find("td").eq(3).find("input").val();
		selectorTable.find("td").eq(3).find("input").val(parseInt(newStok) + 1); // update stok item
		selectorTable.find('td').eq(4).attr('data-harga-asli', parseInt(harga_beli) * parseInt(parseInt(newStok) + 1));
		selectorTable.find("td").eq(4).find('input').val(parseInt(harga_beli) * parseInt(parseInt(newStok) + 1));
		
		totalPrice();
	}
}

function putIntoTable (options) {
	var rowItems = $('<tr/>',{
		'data-kode' : options.kode_barang,
		'data-id' : options.id_barang,
		'data-barang' : options.barang,
		'data-category' : options.id_category,
		'data-number' : options.number,
	});
	// COLUMN NAMA & CATEGORY
	rowItems.append(`
		<td>
			<small>
				Kode : <b>${options.kode_barang}</b><br/>
				Barang : <b>${options.barang}</b> <br/>
				Tipe Kategori : <b>${options.category}</b>
			</small>
		</td>
	`);
	// COLUMN TEBAL
	rowItems.append(`
		<td>
			<input 
				type = 'number
				min = '1' 
				class = 'form-control'
				id = 'inputTebal'
				data-number = '${options.number}'/>
		</td>
	`);
	// COLUMN HARGA BELI
	rowItems.append(`
		<td>
			<input 
				type = 'number' 
				min = '1' 
				class = 'form-control' 
				data-harga = '0'
				id = 'hargaBeli'
				value = '0'
				data-number = '${options.number}'
				onChange = 'hargaChange(this, "${options.number}");' 
				onBlur = 'validasiLimit(this.value, "hargaBeli", "${options.number}");'/>
		</td>
	`);
	// COLUMN JUMLAH ITEM
	rowItems.append(`
		<td>
			<input 
				min = '1' 
				style = 'width:100px;'
				type = 'text' 
				class = 'form-control'
				data-number = '${options.number}'
				id = 'stockInput-${options.number}'
				value = '1'
				onChange = 'hargaChange1(this);' 
				onBlur = 'hargaChange1(this);'/>
		</td>
	`);
	// COLUMN SUB TOTAL HARGA
	rowItems.append(`
		<td
			id = 'totalHarga' 
			data-number = '${options.number}'>
			<input 
				type = 'number' 
				min = '1' 
				class = 'form-control'
				data-harga-asli = '0'
				onChange = 'hargaChange2(this, "${options.number}")'/>
		</td>
	`);
	// COLUMN ACTION REMOVE
	rowItems.append(`
		<td align = 'center'>
			<button class = 'btn btn-xs btn-danger' title = 'Delete Item' onClick = 'deleteItem(this, ${options.number})'>
				<i class = 'fa fa-times'></i>
			</button>
		</td>
	`);

	$("table#cartTable tbody").append(rowItems); // APPEND ELEMENT TO TABLE TBODY
	$('.money').simpleMoneyFormat();
	console.log("Nomor -> " + options.number);
	no += 1;
	totalPrice();
}

function deleteItem(selector, key) {
	if (localStorage.getItem("productsInCart") !== null) {
		items = JSON.parse(localStorage.getItem("productsInCart"));
	}

	console.log('[KEY]' , key);
	items.splice(key, 1);
	$(selector).closest('tr').remove();
	localStorage.setItem('productsInCart', JSON.stringify(items));
	totalPrice();
}

function clearTrx() {
	console.log('[CLEAR]');
	localStorage.removeItem('productsInCart');
	items = [];
	$('#cartTable tbody').html('');
	no = 0;
	totalPrice();
	clearForm();
}

function clearForm() {
	$('#trxNama').val("");
	$('#trxTebal').val("");
	$('#trxCategory').val("");
	$('#trxTanggal').val("");
	$('#trxSupplier').val("");
}

//- jumlah semua harga barang
function totalPrice() {
	var totalGrandPrice = 0;
	$("table#cartTable > tbody").find("tr").each(function(i) {
		var a = $(this).find("td").eq(4).attr('data-harga-asli') || 0;
		totalGrandPrice = parseInt(totalGrandPrice) + parseInt(a);
	});

	console.log('totalGrandPrice' , totalGrandPrice);
	$("#totalPrice").text(rupiah((totalGrandPrice)));
	$("#totalPrice").attr("data-harga", parseInt(totalGrandPrice));
}

//- validasi value opo iku
function validasiLimit(min, id, number) {
	if (parseInt(min) < parseInt($("#" + id).attr("min"))) {
		$("#tambahBarang").attr("disabled", "disabled");
		return $("#" + id + "[data-id='" + number + "']").focus();
	} else {
		$("#tambahBarang").removeAttr("disabled");		
	}
}

//- change jumlah harga yang harus di bayar jika input harga jual berubah
function hargaChange(element, number) {
	var stok = $(`#stockInput-${number}`).val();
	var harga_beli = element.value;
	harga_beli = harga_beli.replace(/[^\w\s]/gi, '');
	console.log(`stok --> ${stok} harga_beli --> ${harga_beli}`);

	var totalHarga = parseInt(harga_beli) * parseInt(stok);

	if (harga_beli == "" || harga_beli < 0) {
		$(element).val('1').attr('data-harga', 1);
	} else {
		$(element).attr('data-harga', harga_beli);
		$("#totalHarga[data-number='"+number+"']").attr('data-harga-asli', totalHarga);
		$("#totalHarga[data-number='"+number+"']").find('input').val(totalHarga);
	}

	totalPrice();
}

//- change jumlah harga jika input stock berubah
function hargaChange1(element) {
	var num = $(element).attr('data-number');
	var stok = element.value;
	var harga_beli = $("#hargaBeli[data-number='"+num+"']").attr('data-harga');
	var totalHarga = parseInt(harga_beli) * parseInt(stok);

	console.log(`totalHarga --> ${totalHarga} harga --> ${harga_beli} stok --> ${stok}`);
	if ($(element).val() == "" || $(element).val() < 0) {
		$(element).val("1");
	} else {
		$("#totalHarga[data-number='"+num+"']").attr('data-harga-asli', totalHarga);
		$("#totalHarga[data-number='"+num+"']").find('input').val(totalHarga);
	}

	totalPrice();
}

//- hitung harga blei dari input total harga beli
function hargaChange2 (element, number) {
	var totalHarga = element.value;
	totalHarga = totalHarga.replace(/[^\w\s]/gi, '');
	var stok = $(`#stockInput-${number}`).val();
	var harga_beli = Math.floor(parseInt(totalHarga)/parseInt(stok));

	console.log(`totalHarga --> ${totalHarga} harga --> ${harga_beli} stok --> ${stok}`);
	$(`#hargaBeli[data-number='${number}']`).attr('data-harga', parseInt(harga_beli));
	$(`#hargaBeli[data-number='${number}']`).val(harga_beli);

	$("#totalHarga[data-number='"+number+"']").attr('data-harga-asli', parseInt(totalHarga));

	totalPrice();
}

function openStruk (filename) {
	$('#tempalteStrukJP').modal('show');
	$("#tempalteStrukJP iframe#viewStruk").attr('src','/uploads/files/'+filename);
}

//- method pembayaran
function paidNow(selector) {
	var trxTanggal = $('#trxTanggal').val();
	var id_supplier = $('#trxSupplier').val();
	$(selector).attr('disabled', true);
	if (trxTanggal == "" || id_supplier == "") {
		$.smallBox({
			title : "Peringatan",
			content : "<i class='fa fa-clock-o'></i> <i> Data Transaksi Belum Lengkap</i>",
			color : "#C46A69",
			iconSmall : "fa fa-times  fa-1x fadeInRight animated",
			timeout : 1000
		});
		$(selector).attr('disabled', false);
	} else {
		if ($("table#cartTable > tbody > tr").length == 0 ) {
			$.smallBox({
				title : "Peringatan",
				content : "<i class='fa fa-clock-o'></i> <i> Keranjang Transaksi Masih Kosong </i>",
				color : "#C46A69",
				iconSmall : "fa fa-times  fa-1x fadeInRight animated",
				timeout : 1000
			});
			$(selector).attr('disabled', false);
		} else {
			$.SmartMessageBox({
				title : "Peringatan",
				content : "apakah yakin dengan transaksi anda sekarang ?",
				buttons : '[No][Yes]'
			}, function (ButtonPressed) {
				if (ButtonPressed === "Yes") {
					var totalQty = 0;
					let dataItems = [];
					$("table#cartTable > tbody > tr").each(function(i) {
						var stokItem = $(this).find("td").eq(3).find("input").val();
						var id_category = $(this).attr('data-category');
						var id_barang = $(this).attr('data-id');
						dataItems.push({
							barang : id_barang,
							nama_barang : $(this).attr('data-barang'),
							category : id_category,
							supplier : id_supplier,
							tebal : $(this).find("td").eq(1).find('input').val(),
							harga_beli : parseInt($(this).find("td").eq(2).find("input").attr('data-harga')),
							qty : parseInt(stokItem),
							subTotal : parseInt($(this).find("td").eq(4).attr('data-harga-asli')),
						});
						totalQty += parseInt(stokItem);
					});

					var dataToSend = {
						tanggal : trxTanggal,
						supplier : id_supplier,
						items : dataItems,
						totalQty : totalQty,
						totalHarga : parseInt($("#totalPrice").attr("data-harga")),
					}

					console.log('[dataToSend]', dataToSend);
					$.ajax({
						url : '/transaksi/pembelian/prosesTrx',
						type : 'POST',
						dataType : 'json',
						data : {data : JSON.stringify(dataToSend)},
						success : function (msg) {
							if (msg.status == 200) {
								$.smallBox({
									title : "Sukses",
									content : "<i> "+msg.message+"</i>",
									color : "#659265",
									iconSmall : "fa fa-check fa-1x fadeInRight animated",
									timeout : 3000
								});
								$("button#cetakStruk").attr('disabled', false);
								$('button#cetakStruk').attr('onClick', `openStruk('/uploads/files/${msg.filename}')`);
								openStruk(msg.filename);
								clearTrx();
							} else {
								$.smallBox({
									title : "Peringatan",
									content : "<i class='fa fa-clock-o'></i> <i> "+msg.message+"</i>",
									color : "#C46A69",
									iconSmall : "fa fa-times fa-1x fadeInRight animated",
									timeout : 3000
								});
							}
						},
						error : function (jqXHR, textStatus, errorThrown) {
							$.smallBox({
								title : "Peringatan",
								content : "<i> "+errorThrown+"</i>",
								color : "#C46A69",
								iconSmall : "fa fa-times fa-1x fadeInRight animated",
								timeout : 3000
							});
							$(selector).attr('disabled', false);	
						}
					});
				} else {
					$(selector).attr('disabled', false);
				}
			})
		}
	}
}