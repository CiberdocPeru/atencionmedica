(function () {
  var f = document.getElementById('bookForm');
  if (!f) return;
  var err = document.getElementById('err'),
      mod = document.getElementById('modalidad'),
      box = document.getElementById('distritoBox'),
      cc = document.getElementById('cc'),
      d = document.getElementById('fecha');

  var t = new Date();
  d.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');

  function toggle() { box.style.display = mod.value === 'Online' ? 'none' : 'grid'; }
  mod.addEventListener('change', toggle);
  toggle();

  document.querySelectorAll('[data-mod]').forEach(function (a) {
    a.addEventListener('click', function () { mod.value = a.dataset.mod; toggle(); });
  });

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = Object.fromEntries(new FormData(f).entries());
    var tel = (v.tel || '').replace(/\D/g, '');
    if (!(v.nombre || '').trim() || tel.length < 8 || !v.fecha) {
      err.textContent = 'Completa el nombre, un teléfono válido y la fecha preferida.';
      return;
    }
    if (v.modalidad === 'A domicilio' && !(v.direccion || '').trim()) {
      err.textContent = 'Indica tu distrito y dirección para la visita a domicilio.';
      return;
    }
    err.textContent = '';
    var fecha = new Date(v.fecha + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
    var rows = [['Paciente', v.nombre], ['Teléfono', '+' + cc.value + ' ' + v.tel], ['Tipo', v.tipo], ['Modalidad', v.modalidad]];
    if (v.modalidad === 'A domicilio') rows.push(['Dirección', v.direccion]);
    rows.push(['Fecha preferida', fecha]);
    var m = 'Hola, quisiera agendar una cita.%0A%0A' +
      rows.map(function (x) { return '*' + x[0] + ':* ' + encodeURIComponent(x[1]); }).join('%0A') +
      ((v.msg || '').trim() ? '%0A%0A' + encodeURIComponent(v.msg.trim()) : '');
    window.open('https://wa.me/51992219206?text=' + m, '_blank', 'noopener');
  });
})();
