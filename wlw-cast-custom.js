var d = document;

if (d.getElementById('wlw_custom')==null) {

var p1 = d.querySelectorAll('.block_playdata_01_text');
// 使用率 ... usage rate
var ur = parseFloat(p1[0].innerHTML);
// 勝利数 ... win count
var wc = parseInt(p1[1].innerHTML);
// 総撃破数 ... crush count
var crc = parseInt(p1[2].innerHTML);
// 総撤退数 ... withdraw count
var wdc = parseInt(p1[3].innerHTML);

var p2 = d.querySelectorAll('.block_playdata_02_text');
// キャスト別評価(平均) ... total page
var tp = parseFloat(p2[0].innerHTML);
// 勝利時(平均) ... win page
var wp = parseFloat(p2[1].innerHTML);
// 敗北時(平均) ... lose page
var lp = parseFloat(p2[2].innerHTML);

// 獲得ナイス(平均) ... total nice
var tn = parseFloat(p2[3].innerHTML);
// 勝利時(平均) ... win nice
var wn = parseFloat(p2[4].innerHTML);
// 敗北時(平均) ... lose nice
var ln = parseFloat(p2[5].innerHTML);

// 敗北数 ... lose count
var lc = 0;
if ((tp-lp)!=0) {
	lc = parseInt(Math.round((wp-tp)*wc/(tp-lp)));
} 
// 勝率 ... win rate
var wr = 0;
if ((wc+lc)!=0) {
	wr = Math.round(wc/(wc+lc)*100*10)/10;
}
// Kill Ratio ... kill ratio
var kr = 0;
if (wdc!=0) {
	kr = Math.round(crc/wdc*100)/100;
}
// 全体勝利数 ... all win count
var awc = 0;
// 全体敗北数 ... all lose count
var alc = 0;

// キャストID ... cast id
// 文字数圧縮のため、パラメータはcastを前提とする
var q = window.location.search.substring(1);
var ci = q.split("=")[1];
var pci = "p" + ci;

// キャストデータ ... cast data
// 前回のキャストデータ ... pre cast data
// 日時情報、使用率、勝利数、敗北数、勝率、総撃破数、総撤退数、Kill Ratio、
// キャスト別評価(平均)、勝利時(平均)、敗北時(平均)、
// 獲得ナイス(平均)、勝利時(平均)、敗北時(平均)
var now = new Date().getTime();
var cd = [now, ur, wc, lc, wr, crc, wdc, kr, tp, wp, lp, tn, wn, ln];
var pcd = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var ppcd = pcd.concat();

var day = 1000*3600*24;
// Cookieの有効期限(365日間)
var ex = new Date();
ex.setTime(now+day*365);

// Cookieの読み込み
// 前回のキャストデータを取得
if (d.cookie) {
	var c = d.cookie.split(";");
	for (var i = 0; i < c.length; i++) {
		var kv = c[i].trim().split("=");
		var tpcd = unescape(kv[1]).split(":");
		if (isFinite(kv[0])) {
			awc += parseInt(tpcd[2]);
			alc += parseInt(tpcd[3]);
		}
		if (kv[0] == ci) {
			pcd = tpcd;
		}
		if (kv[0] == pci) {
			ppcd = unescape(kv[1]).split(":");
		}
	}
}

// 全キャスト勝率 ... all win rate
var awr = 0;
// 全キャスト勝利数 ... all win count
awc = awc - parseInt(pcd[2]) + wc;
// 全キャスト敗北数 ... all lose count
alc = alc - parseInt(pcd[3]) + lc;
if ((awc+alc)!=0) {
	awr = Math.round(awc/(awc+alc)*100*10)/10;
}

// 使用率、勝利数、キャスト別評価(平均)、勝利時(平均)、敗北時(平均)で比較
if (cd[1]!=pcd[1] || cd[2]!=pcd[2] || cd[8]!=pcd[8] || cd[9]!=pcd[9] || cd[10]!=pcd[10]) {
	d.cookie = ci + "=" + escape(cd.join(":")) + "; expires=" + ex.toUTCString();
}

// 24:00を起点として比較する
var base = new Date();
base.setTime(pcd[0]);
base.setHours(23);
base.setMinutes(59);
base.setSeconds(59);
if (now > base.getTime()) {
	d.cookie = pci + "=" + escape(pcd.join(":")) + "; expires=" + ex.toUTCString();
} else {
	pcd = ppcd;
}

// HTMLの書き換え
var fi = d.querySelector('.frame_inner');
var nfi = fi.cloneNode(true);
nfi.id = "wlw_custom";
var p = nfi.querySelectorAll('.clearfix');
function insert(i, t1, t2) {
	var e = p[0].cloneNode(true);
	var t = e.getElementsByTagName('div');
	t[0].innerHTML = t1;
	t[1].innerHTML = t2;
	nfi.insertBefore(e, p[i]);
}
insert(2,"敗北数",lc+"<span class=\"font_small\">敗</span>");
insert(2,"勝率",wr+"%");
insert(4,"Kill Ratio",kr);
nfi.appendChild(p[4].cloneNode(true));
function diff(i, t) {
	var iad = Math.round((cd[i]-pcd[i])*100)/100;
	var pm = "±";
	if (iad>0) {
		pm = "+";
	}
	if (iad<0) {
		pm = "−";
		iad = Math.abs(iad);
	}
	t.innerHTML = t.innerHTML + " <span style=\"color:#ff0000;\" class=\"font_small\">(" + pm + iad + ")</span>";
}
var npv1 = nfi.querySelectorAll('.block_playdata_01_text');
for (var i = 0; i < 7; i++) {
	diff(i+1, npv1[i]);
}
var npk2 = nfi.querySelectorAll('.block_playdata_02_title');
var npv2 = nfi.querySelectorAll('.block_playdata_02_text');
for (var i = 0; i < 6; i++) {
	diff(i+8, npv2[i]);
}
npk2[3].innerHTML = "<span class=\"font_90\">全キャスト勝率(合計)</span>";
npv2[6].innerHTML = awr + "%";
npk2[4].innerHTML = "<span class=\"font_90\">勝利数(合計)</span>";
npv2[7].innerHTML = awc + "<span class=\"font_small\">勝</span>";
npk2[5].innerHTML = "<span class=\"font_90\">敗北数(合計)</span>";
npv2[8].innerHTML = alc + "<span class=\"font_small\">敗</span>";

fi.parentNode.replaceChild(nfi, fi);

}