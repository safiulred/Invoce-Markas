function clearTrx() {
	console.log('[CLEAR]');
	localStorage.removeItem('productsInCart');
	items = [];
	$('#trxCustomer').val("");
	$('#namabarang').val("");
	$('#trxKet').val("");
	$('#cartTable tbody').html('');
	// $('#cetakStruk').attr('disabled', true);
	// $('#cetakStruk').attr('onClick', "");

	$('input#fileImg').val("");
	clearImg();

	no = 0;
	createJasa();
	getNumber();
	totalPrice();
}

function getNumber () {
	$.ajax({
		url : '/transaksi/get-number',
		type : 'GET',
		success : function (msg) {
			$('#noOrder').val(msg);
		},
		error : function (jqXHR, textStatus, errorThrown) {
			$.smallBox({
				title : "Peringatan",
				content : "<i> Internal Server Error</i>",
				color : "#C46A69",
				iconSmall : "fa fa-times fa-1x fadeInRight animated",
				timeout : 3000
			});
		}
	})
}

function createJasa () {
	var elmtJasa = `<tr data-jenis = '0' data-beli = '0' data-barang = 'jasa' data-number = '0'>`;
	elmtJasa += `<td><small><b>JASA</b></small></td>`;
	elmtJasa += `<td align = 'center'>-</td>`;
	elmtJasa += `
		<td>
			<input type="text" class="form-control" id="lebarPlat" value="0" data-number="0"/>
		</td>
	`;
	elmtJasa += `
		<td>
			<input type="text" class="form-control" id="panjangPlat" value="0" data-number="0"/>
		</td>
	`;
	elmtJasa += `
		<td>
			<input 
				type="number" 
				min="0" 
				class="form-control" 
				data-harga="0" 
				id="hargaJual" 
				value="0" 
				data-number="0" 
				onchange="hargaChange(this, 0);"/>
		</td>
	`;
	elmtJasa += `
		<td>
			<input 
				style="width:100px;" 
				type="text" 
				class="form-control" 
				data-number="0" 
				id="stockInput-0" 
				value="1" 
				onchange="hargaChange1(this);" 
				onblur="hargaChange1(this);"/>
		</td>
	`;
	elmtJasa += `<td id="subTotal" data-harga-asli="0" data-number="0"> 0 </td>`;
	elmtJasa += `<td align = 'center'><input type = 'checkbox' name = 'SNI'/></td>`;
	elmtJasa += `<td align = 'center'><input type = 'checkbox' name = 'NON SNI'/></td>`;
	elmtJasa += `
		<td align = 'center'>
			<center>
				<button class="btn btn-xs btn-danger" title="Delete Item" onclick="deleteItem(this)">
					<i class="fa fa-times"/>
				</button>
			</center>
		</td>
	`;
	elmtJasa +='</tr>';

	$('#cartTable tbody').html(elmtJasa);
}

function pencarianModal(width) {
	$('div#componentModal1 div#AllModal').html('');
	$('div#componentModal1 .modal-admin').css('width', width);
	$('div#componentModal1 .modal-dialog').css('width', width);
	$('div#componentModal1 div#modal_All').modal('show');
	$('div#componentModal1 div#modal_All div#kosong').html('');
	$('div#componentModal1 div#modal_All h2.modal-title p ').text("Pencarian Barang");
	$('div#componentModal1 div#AllModal').load(`/transaksi/order/viewSearchProduct/${no}`);
}

function enterProduk(e, element) {
	if(e.keyCode == 13) {
		if (element.value != "") {
			var arr_item = element.value.split('-');
			var id_gudang = $("#list-barang").find(`option[value = '${element.value}']`).attr('data-id');
			cariProduct(id_gudang);
		}
	}
}

function cariProduct(key) {
	if (key != '0') {
		$.ajax({
			url : '/transaksi/order/prosesCari',
			type : 'POST',
			data : { id_gudang : key, id_category : '' },
			dataType : 'json',
			success : function (msg) {
				if (msg.status == 200) {
					var datas = msg.data;
					if (datas.length > 0 ) {
						var dataSearch = datas[0];
						dataSearch['jenis'] = 1;
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
	} else {
		console.log('[INSERT JASA]');
		var selectorTableJasa = $("table#cartTable > tbody > tr[data-jenis='0']");
		if (selectorTableJasa.html() == undefined) {
			var rowItems = $('<tr/>',{
				'data-jenis' : key, 
				'data-beli' : 0,
				'data-barang' : 'Jasa',
				'data-number' : no,
			});

			// COLUMN JASA
			rowItems.append(`
				<td>
					<small>
						<b>JASA</b><br/>
					</small>
				</td>
			`);
			// COLUMN STOK TERSEDIA
			rowItems.append(`
				<td align = 'center'>-</td>
			`);
			// COLUMN LEBAR
			rowItems.append(`
				<td>
					<input
						class = 'form-control'
						value = '0'
						data-number = '${no}'
						type = 'text'
						id = 'lebarPlat'/>
				</td>
			`);
			// COLUMN PANJANG
			rowItems.append(`
				<td>
					<input
						class = 'form-control'
						value = '0'
						data-number = '${no}'
						type = 'text'
						id = 'panjangPlat'/>
				</td>
			`);
			// COLUMN HARGA JUAL
			rowItems.append(`
				<td>
					<input 
						type = 'number' 
						min = '0' 
						class = 'form-control' 
						data-harga = '0'
						id = 'hargaJual'
						value = '0'
						data-number = '${no}'
						onChange = 'hargaChange(this, "${no}");' />
				</td>
			`);
			// COLUMN QTY
			rowItems.append(`
				<td>
					<input 
						style = 'width:100px;'
						type = 'text' 
						class = 'form-control'
						data-number = '${no}'
						id = 'stockInput-${no}'
						value = '1'
						onChange = 'hargaChange1(this);' 
						onBlur = 'hargaChange1(this);'/>
				</td>
			`);
			// COLUMN SUB TOTAL HARGA
			rowItems.append(`
				<td
					id = 'subTotal' 
					data-harga-asli = '0'
					data-number = '${no}'>
					0
				</td>
			`);
			// COLUMN SNI
			rowItems.append(`
				<td align = 'center'>
					<input type = 'checkbox' name='SNI'/>
				</td>
			`);
			// COLUMN NON SNI
			rowItems.append(`
				<td align = 'center'>
					<input type = 'checkbox' name='NON SNI'/>
				</td>
			`);
			// COLUMN ACTION REMOVE
			rowItems.append(`
				<td align = 'center'>
					<center>
						<button class = 'btn btn-xs btn-danger' title = 'Delete Item' onClick = 'deleteItem(this)'>
							<i class = 'fa fa-times'></i>
						</button>
					</center>
				</td>
			`);


			$("table#cartTable tbody").append(rowItems); // APPEND ELEMENT TO TABLE TBODY
			no += 1;
			totalPrice();
		}
	}
}

function chooseProduct(datas) {
	var selectorTable = $("table#cartTable > tbody > tr[data-id='"+datas._id+"']");
	if (selectorTable.html() == undefined) {
		console.log('[PUT NEW ITEM IN TABLE]');
		console.log('[CHOOSE] ', datas);
		putIntoTable({
			jenis : datas.jenis,
			id_gudang : datas._id,
			id_barang : datas.barang&&datas.barang._id?datas.barang._id:null,
			kode_barang : datas.barang&&datas.barang.kode?datas.barang.kode:'',
			nama_barang : datas.barang&&datas.barang.nama?datas.barang.nama:'',
			id_category : datas.category&&datas.category._id?datas.category._id:'',
			category : datas.category&&datas.category.nama?datas.category.nama:'',
			id_supplier : datas.supplier&&datas.supplier._id?datas.supplier._id:'',
			supplier : datas.supplier&&datas.supplier.nama?datas.supplier.nama:'',
			tebal : datas.tebal.toString(),
			stock : datas.stock,
			harga_jual : datas.harga_jual,
			harga_beli : datas.harga_beli,
			lebar : datas.lebar?datas.lebar:'',
			panjang : datas.panjang?datas.panjang:'',
			number : no,
		});
	} else {
		console.log('[UPDATE QTY IN TABLE]');
		var stockReady = datas.stock;
		var hargaJual = datas.harga_jual;
		var newStok = selectorTable.find("td").eq(3).find("input").val();
		var subTotal = parseInt(hargaJual) * parseFloat(parseFloat(newStok) + 1);

		if (parseFloat(newStok)+1 > stockReady) {
			$.smallBox({
				title : "Peringatan",
				content : "<i class='fa fa-clock-o'></i> <i> jumlah pembelian tidak boleh lebih dari stok barang</i>",
				color : "#C46A69",
				iconSmall : "fa fa-times  fa-1x fadeInRight animated",
				timeout : 1500
			});
		} else {
			selectorTable.find("td").eq(3).find("input").val(parseFloat(newStok) + 1); // update stok item
			selectorTable.find('td').eq(4).attr('data-harga-asli', subTotal).text(rupiah(subTotal));
		}

		totalPrice();
	}
}

function putIntoTable (options) {
	console.log(options);
	var rowItems = $('<tr/>',{
		'data-jenis' : options.jenis,
		'data-beli' : options.harga_beli,
		'data-id' : options.id_gudang,
		'data-barang' : options.nama_barang,
		'data-id-barang' : options.id_barang,
		'data-id-category' : options.id_category,
		'data-id-supplier' : options.id_supplier,
		'data-tebal' : options.tebal,
		'data-lebar' : options.lebar,
		'data-panjang' : options.panjang,
		'data-number' : options.number
	});
	let elmtDimensi = `
		<br/>
		Ukuran : <b>${options.lebar}x${options.panjang}</b>
	`;

	// COLUMN KODE, NAMA, CATEGORY, TEBAL
	rowItems.append(`
		<td>
			<small>
				Kode : <b>${options.kode_barang}</b><br/>
				Barang : <b>${options.nama_barang}</b> <br/>
				Tebal : <b>${options.tebal}</b><br/>
				Tipe Kategori : <b>${options.category}</b>
			</small>
		</td>
	`);
	// COLUMN STOK TERSEDIA
	rowItems.append(`
		<td align = 'center' id = 'stockReady'>
			${options.stock}
		</td>
	`);
	// COLUMN LEBAR PLAT
	rowItems.append(`
		<td>
			<input
				class = 'form-control'
				data-number = '${options.number}'
				type = 'text'
				value = '${options.lebar?options.lebar:'0'}'
				id = 'lebarPlat'/>
		</td>
	`);
	// COLUMN PANJANG PLAT
	rowItems.append(`
		<td>
			<input
				class = 'form-control'
				data-number = '${options.number}'
				type = 'text'
				value = '${options.panjang?options.panjang:'0'}'
				id = 'panjangPlat'/>
		</td>
	`);
	// COLUMN HARGA JUAL
	rowItems.append(`
		<td>
			<input 
				type = 'number' 
				min = '1' 
				class = 'form-control' 
				data-harga = '${options.harga_jual}'
				id = 'hargaJual'
				value = '${options.harga_jual}'
				data-number = '${options.number}'
				onChange = 'hargaChange(this, "${options.number}");' />
		</td>
	`);
	// COLUMN JUMLAH ITEM
	rowItems.append(`
		<td>
			<input 
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
			id = 'subTotal' 
			data-harga-asli = '${options.harga_jual}'
			data-number = '${options.number}'>
			${options.harga_jual}
		</td>
	`);
	// COLUMN SNI
	rowItems.append(`
		<td align = 'center'>
			<input type = 'checkbox' name='SNI'/>
		</td>
	`);
	// COLUMN NON SNI
	rowItems.append(`
		<td align = 'center'>
			<input type = 'checkbox' name='NON SNI'/>
		</td>
	`);
	// COLUMN ACTION REMOVE
	rowItems.append(`
		<td align = 'center'>
			<center>
				<button class = 'btn btn-xs btn-danger' title = 'Delete Item' onClick = 'deleteItem(this)'>
					<i class = 'fa fa-times'></i>
				</button>
			</center>
		</td>
	`);

	$("table#cartTable tbody").append(rowItems); // APPEND ELEMENT TO TABLE TBODY
	$('.money').simpleMoneyFormat();
	console.log("Nomor -> " + options.number);
	no += 1;
	totalPrice();
}

//- hapus data barang yang akan di beli
function deleteItem(element) {
	$(element).closest("tr").remove();
	totalPrice();
}

//- jumlah semua harga barang
function totalPrice() {
	var totalGrandPrice = 0;
	$("table#cartTable > tbody").find("tr").each(function(i) {
		var a = $(this).find("td").eq(6).attr('data-harga-asli') || 0;
		totalGrandPrice = parseInt(totalGrandPrice) + parseInt(a);
	});

	console.log('totalGrandPrice' , totalGrandPrice);
	$("#totalPrice").text(rupiah((totalGrandPrice)));
	$("#totalPrice").attr("data-harga", parseInt(totalGrandPrice));
}

//- change jumlah harga yang harus di bayar jika input harga jual berubah
function hargaChange(element, number) {
	var qty = $(element).closest('tr').find(`#stockInput-${number}`).val(); // jumlah item yg akan di jual
	var harga_jual = element.value;
	harga_jual = harga_jual.replace(/[^\w\s]/gi, '');
	console.log(`qty --> ${qty}  harga_jual --> ${harga_jual}`);

	var subTotal = parseInt(harga_jual) * parseFloat(qty);

	if (harga_jual == "" || harga_jual < 0) {
		$(element).val('1').attr('data-harga', 1);
	} else {
		$(element).attr('data-harga', harga_jual);
		$(element).closest('tr').find("#subTotal").attr('data-harga-asli', subTotal);
		$(element).closest('tr').find("#subTotal").text(rupiah(subTotal));
	}
	totalPrice();
}

//- change jumlah harga jika input stock berubah
function hargaChange1(element) {
	var qty = element.value;
	var num = $(element).attr('data-number');
	var stockReady = $(element).closest('tr').find('td#stockReady').text(); // stock yg tersedia
	var harga_jual = $(element).closest('tr').find('#hargaJual').attr('data-harga');
	var subTotal = parseInt(harga_jual) * parseFloat(qty);

	console.log(`stockReady --> ${stockReady} qty --> ${qty}  harga_jual --> ${harga_jual} subTotal --> ${subTotal}`);
	if (qty == "" || parseFloat(qty) < 0) {
		$(element).val('1');
	} else if (parseFloat(qty) > parseFloat(stockReady)) {
		$.smallBox({
			title : "Peringatan",
			content : "<i class='fa fa-clock-o'></i> <i> jumlah pembelian tidak boleh lebih dari stok barang</i>",
			color : "#C46A69",
			iconSmall : "fa fa-times  fa-1x fadeInRight animated",
			timeout : 1500
		});
		// $(element).val('1');
		$(element).val(Number(qty - 1));
	} else {
		$(element).closest('tr').find("#subTotal").attr('data-harga-asli', subTotal);
		$(element).closest('tr').find("#subTotal").text(rupiah(subTotal));
	}

	totalPrice();
}

function openStruk (filename) {
	$('#tempalteStrukJP').modal('show');
	$("#tempalteStrukJP iframe#viewStruk").attr('src','/uploads/files/'+filename);
}

function paidNow(selector) {
	$(selector).attr('disabled', true);
	var trxTanggal = $('#trxTanggal').val();
	var id_customer = $('#trxCustomer').val();
	var keterangan = $('#trxKet').val();
	var no_order = $('#noOrder').val();
	var files = $('#fileImg')[0].files;
	if (trxTanggal == "" || id_customer == "" || no_order == "" || !files) {
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
						var stokReady = $(this).find('td').eq(1).text();
						var qty = $(this).find("td").eq(5).find("input").val();
						var id_barang = $(this).attr('data-id-barang');
						var id_category = $(this).attr('data-id-category');
						var id_supplier = $(this).attr('data-id-supplier');
						var sni = $(this).find('td').eq(7).find('input').is(':checked');
						var non_sni = $(this).find('td').eq(8).find('input').is(':checked');
						var lebarPlat = $(this).find('td').eq(2).find('input').val();
						var panjangPlat = $(this).find('td').eq(3).find('input').val();
						
						dataItems.push({
							jenis : $(this).attr('data-jenis'),
							id_product : $(this).attr('data-id'), // id_gudang or id_gudang pecah
							nama_barang : $(this).attr('data-barang'),
							barang : id_barang,
							category : id_category,
							supplier : id_supplier,
							lebar : lebarPlat, //$(this).attr('data-lebar'),
							panjang : panjangPlat, //$(this).attr('data-panjang'),
							tebal : $(this).attr('data-tebal'),
							sni : sni,
							non_sni : non_sni,
							harga_beli : parseInt($(this).attr('data-beli')),
							harga_jual : parseInt($(this).find("td").eq(4).find("input").attr('data-harga')),
							qty : parseInt(qty),
							stokReady : parseInt(stokReady),
							subTotal : parseInt($(this).find("td").eq(6).attr('data-harga-asli')),
						});
						totalQty += parseInt(qty);
					});

					var dataToSend = {
						tanggal : trxTanggal,
						totalQty : totalQty,
						totalOrder : dataItems.length,
						totalHarga : parseInt($("#totalPrice").attr("data-harga")),
						customer : id_customer!="" ? id_customer : null,
						items : dataItems,
						no_order : no_order,
						keterangan : keterangan
					};
					console.log(dataToSend);

					var formData = new FormData();
					formData.append('data', JSON.stringify(dataToSend));
					formData.append('imagePlat', files[0]); 
					$.ajax({
						url : '/transaksi/order/prosesTrx',
						type : 'POST',
						// dataType : 'json',
						// data : {data : JSON.stringify(dataToSend)},
						data: formData,
						contentType: false,
						processData: false,
						success : function (msg) {
							$(selector).attr('disabled', false);
							if (msg.status == 200) {
								$.smallBox({
									title : "Sukses",
									content : "<i> Transaksi Berhasil Di Proses</i>",
									color : "#659265",
									iconSmall : "fa fa-check fa-1x fadeInRight animated",
									timeout : 3000
								});
								$("button#cetakStruk").attr('disabled', false);
								$('button#cetakStruk').attr('onClick', `openStruk('${msg.filename}')`);
								openStruk(msg.filename);
								closeForm('#formUploadtable');
								clearTrx();
								refreshData();
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
								content : "<i> Internal Server Error</i>",
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
