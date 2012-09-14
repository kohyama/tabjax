var tabjax = new function () {
  this.str2aa = function (data, rs, fs) {
    var fa, i, j, r, ra = data.split(rs), t = [];
    for (i in ra) {
      r = [];
      fa = ra[i].split(fs);
      for (j in fa)
        r.push(fa[j]);
      t.push(r);
    }
    return t;
  }

  this.add = function (config) {
    var base;
    var ncols = (function () {
      var i, j, n = 0;
      for (i in config.base.show) {
        m = config.base.show[i][1];
        if (n < m)
          n = m;
      }
      for (j in config.updates) {
        for (i in config.updates[j].show) {
          m = config.updates[j].show[i][1];
          if (n < m)
            n = m;
        }
      }
      return n + 1;
    })();

    function $(id) { return document.getElementById(id); }
    function $n(p) { return document.createElement(p); }
    function $nt(s) { return document.createTextNode(s); }
    function getURL(url, callback) {
      var xhr;
      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4)
          callback(xhr.responseText, xhr.getResponseHeader("Content-Type"));
      };
      xhr.open('GET', url, true);
      xhr.setRequestHeader(
        "If-Modified-Since",
        "Thu, 01 Jun 1970 00:00:00 GMT");
      xhr.send();
    }
    String.prototype.cap = function () { 
       return this.toLowerCase().replace(/^.|\s\S/g,
         function(a) { return a.toUpperCase(); });
    }

    function reload() {
      var i, u;
      for (i in config.updates) {
        u = config.updates[i];
        getURL(u.URL, function (d) {
          var j, k, l, r, table, td, tds, trs, uaa, uf, ur;
          uaa = u.translate(d);
          table = $(config.table_id);
          trs = table.childNodes;
          for (j in trs) {
            if (j == 0)
              continue;
            tds = trs[j].childNodes;
            r = base[j - 1];
            for (k in uaa) {
              ur = uaa[k];
              if (u.match(r, ur)) {
                if (u.ofilter)
                  u.ofilter(r, ur);
                for (l in u.show) {
                  uf = ur[u.show[l][0]];
                  td = tds[u.show[l][1]];
                  td.replaceChild($nt(uf), td.firstChild);
                }
                break;
              }
            }
          }
        });
      }
      setTimeout(reload, config.interval);
    }
  
    table = $(config.table_id);
    while (table.hasChildNodes())
      table.removeChild(table.firstChild);
    getURL(
      config.base.URL,
      function (d) {
        var i, j, k, table, td, tr, tb;
        base = config.base.translate(d);
        table = $(config.table_id);
        // filter
        tr = $n('tr');
        for (j = 0; j < ncols; j++) {
          td = $n('td');
          tb = $n('input');
          tb.type = "text";
          tb.onkeyup = function (e) {
            var i, j, fss, table, td, tds, trs;
            table = $(config.table_id);
            trs = table.childNodes;
            tds = table.firstChild.childNodes;
            fss = [];
            for (j in tds)
              if (tds[j].firstChild)
                fss.push(tds[j].firstChild.value);
            for (i in trs) {
              if (i == 0)
                continue;
              // trs[i].hidden = false;
              if (trs[i].style)
                trs[i].style.display = '';
              if (!(tds = trs[i].childNodes))
                continue;
              for (j in tds) {
                if (fss[j] == "")
                  continue;
                if (!(td = tds[j].firstChild))
                  continue;
                if (td.nodeValue.cap().indexOf(fss[j].cap()) < 0) {
                  // trs[i].hidden = true;
                  if (trs[i].style)
                    trs[i].style.display = 'none';
                }
              }
            }
          };
          td.appendChild(tb);
          tr.appendChild(td);
        }
        table.appendChild(tr);
        // data
        for (i in base) {
          tr = $n('tr');
          for (j = 0; j < ncols; j++) {
            td = $n('td');
            for (k in config.base.show)
              if (config.base.show[k][1] == j)
                td.appendChild($nt(base[i][config.base.show[k][0]]));
            if (!td.hasChildNodes())
              td.appendChild($nt(''));
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }
      }
    );
    reload();
  };
};
