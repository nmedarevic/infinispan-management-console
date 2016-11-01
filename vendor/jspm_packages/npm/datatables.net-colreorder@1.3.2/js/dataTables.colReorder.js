/* */ 
"format cjs";
(function(process) {
  (function(factory) {
    if (typeof define === 'function' && define.amd) {
      define(['jquery', 'datatables.net'], function($) {
        return factory($, window, document);
      });
    } else if (typeof exports === 'object') {
      module.exports = function(root, $) {
        if (!root) {
          root = window;
        }
        if (!$ || !$.fn.dataTable) {
          $ = require('datatables.net')(root, $).$;
        }
        return factory($, root, root.document);
      };
    } else {
      factory(jQuery, window, document);
    }
  }(function($, window, document, undefined) {
    'use strict';
    var DataTable = $.fn.dataTable;
    function fnInvertKeyValues(aIn) {
      var aRet = [];
      for (var i = 0,
          iLen = aIn.length; i < iLen; i++) {
        aRet[aIn[i]] = i;
      }
      return aRet;
    }
    function fnArraySwitch(aArray, iFrom, iTo) {
      var mStore = aArray.splice(iFrom, 1)[0];
      aArray.splice(iTo, 0, mStore);
    }
    function fnDomSwitch(nParent, iFrom, iTo) {
      var anTags = [];
      for (var i = 0,
          iLen = nParent.childNodes.length; i < iLen; i++) {
        if (nParent.childNodes[i].nodeType == 1) {
          anTags.push(nParent.childNodes[i]);
        }
      }
      var nStore = anTags[iFrom];
      if (iTo !== null) {
        nParent.insertBefore(nStore, anTags[iTo]);
      } else {
        nParent.appendChild(nStore);
      }
    }
    $.fn.dataTableExt.oApi.fnColReorder = function(oSettings, iFrom, iTo, drop, invalidateRows) {
      var i,
          iLen,
          j,
          jLen,
          jen,
          iCols = oSettings.aoColumns.length,
          nTrs,
          oCol;
      var attrMap = function(obj, prop, mapping) {
        if (!obj[prop] || typeof obj[prop] === 'function') {
          return;
        }
        var a = obj[prop].split('.');
        var num = a.shift();
        if (isNaN(num * 1)) {
          return;
        }
        obj[prop] = mapping[num * 1] + '.' + a.join('.');
      };
      if (iFrom == iTo) {
        return;
      }
      if (iFrom < 0 || iFrom >= iCols) {
        this.oApi._fnLog(oSettings, 1, "ColReorder 'from' index is out of bounds: " + iFrom);
        return;
      }
      if (iTo < 0 || iTo >= iCols) {
        this.oApi._fnLog(oSettings, 1, "ColReorder 'to' index is out of bounds: " + iTo);
        return;
      }
      var aiMapping = [];
      for (i = 0, iLen = iCols; i < iLen; i++) {
        aiMapping[i] = i;
      }
      fnArraySwitch(aiMapping, iFrom, iTo);
      var aiInvertMapping = fnInvertKeyValues(aiMapping);
      for (i = 0, iLen = oSettings.aaSorting.length; i < iLen; i++) {
        oSettings.aaSorting[i][0] = aiInvertMapping[oSettings.aaSorting[i][0]];
      }
      if (oSettings.aaSortingFixed !== null) {
        for (i = 0, iLen = oSettings.aaSortingFixed.length; i < iLen; i++) {
          oSettings.aaSortingFixed[i][0] = aiInvertMapping[oSettings.aaSortingFixed[i][0]];
        }
      }
      for (i = 0, iLen = iCols; i < iLen; i++) {
        oCol = oSettings.aoColumns[i];
        for (j = 0, jLen = oCol.aDataSort.length; j < jLen; j++) {
          oCol.aDataSort[j] = aiInvertMapping[oCol.aDataSort[j]];
        }
        oCol.idx = aiInvertMapping[oCol.idx];
      }
      $.each(oSettings.aLastSort, function(i, val) {
        oSettings.aLastSort[i].src = aiInvertMapping[val.src];
      });
      for (i = 0, iLen = iCols; i < iLen; i++) {
        oCol = oSettings.aoColumns[i];
        if (typeof oCol.mData == 'number') {
          oCol.mData = aiInvertMapping[oCol.mData];
        } else if ($.isPlainObject(oCol.mData)) {
          attrMap(oCol.mData, '_', aiInvertMapping);
          attrMap(oCol.mData, 'filter', aiInvertMapping);
          attrMap(oCol.mData, 'sort', aiInvertMapping);
          attrMap(oCol.mData, 'type', aiInvertMapping);
        }
      }
      if (oSettings.aoColumns[iFrom].bVisible) {
        var iVisibleIndex = this.oApi._fnColumnIndexToVisible(oSettings, iFrom);
        var iInsertBeforeIndex = null;
        i = iTo < iFrom ? iTo : iTo + 1;
        while (iInsertBeforeIndex === null && i < iCols) {
          iInsertBeforeIndex = this.oApi._fnColumnIndexToVisible(oSettings, i);
          i++;
        }
        nTrs = oSettings.nTHead.getElementsByTagName('tr');
        for (i = 0, iLen = nTrs.length; i < iLen; i++) {
          fnDomSwitch(nTrs[i], iVisibleIndex, iInsertBeforeIndex);
        }
        if (oSettings.nTFoot !== null) {
          nTrs = oSettings.nTFoot.getElementsByTagName('tr');
          for (i = 0, iLen = nTrs.length; i < iLen; i++) {
            fnDomSwitch(nTrs[i], iVisibleIndex, iInsertBeforeIndex);
          }
        }
        for (i = 0, iLen = oSettings.aoData.length; i < iLen; i++) {
          if (oSettings.aoData[i].nTr !== null) {
            fnDomSwitch(oSettings.aoData[i].nTr, iVisibleIndex, iInsertBeforeIndex);
          }
        }
      }
      fnArraySwitch(oSettings.aoColumns, iFrom, iTo);
      for (i = 0, iLen = iCols; i < iLen; i++) {
        oSettings.oApi._fnColumnOptions(oSettings, i, {});
      }
      fnArraySwitch(oSettings.aoPreSearchCols, iFrom, iTo);
      for (i = 0, iLen = oSettings.aoData.length; i < iLen; i++) {
        var data = oSettings.aoData[i];
        var cells = data.anCells;
        if (cells) {
          fnArraySwitch(cells, iFrom, iTo);
          for (j = 0, jen = cells.length; j < jen; j++) {
            if (cells[j] && cells[j]._DT_CellIndex) {
              cells[j]._DT_CellIndex.column = j;
            }
          }
        }
        if (data.src !== 'dom' && $.isArray(data._aData)) {
          fnArraySwitch(data._aData, iFrom, iTo);
        }
      }
      for (i = 0, iLen = oSettings.aoHeader.length; i < iLen; i++) {
        fnArraySwitch(oSettings.aoHeader[i], iFrom, iTo);
      }
      if (oSettings.aoFooter !== null) {
        for (i = 0, iLen = oSettings.aoFooter.length; i < iLen; i++) {
          fnArraySwitch(oSettings.aoFooter[i], iFrom, iTo);
        }
      }
      if (invalidateRows || invalidateRows === undefined) {
        $.fn.dataTable.Api(oSettings).rows().invalidate();
      }
      for (i = 0, iLen = iCols; i < iLen; i++) {
        $(oSettings.aoColumns[i].nTh).off('click.DT');
        this.oApi._fnSortAttachListener(oSettings, oSettings.aoColumns[i].nTh, i);
      }
      $(oSettings.oInstance).trigger('column-reorder.dt', [oSettings, {
        from: iFrom,
        to: iTo,
        mapping: aiInvertMapping,
        drop: drop,
        iFrom: iFrom,
        iTo: iTo,
        aiInvertMapping: aiInvertMapping
      }]);
    };
    var ColReorder = function(dt, opts) {
      var settings = new $.fn.dataTable.Api(dt).settings()[0];
      if (settings._colReorder) {
        return settings._colReorder;
      }
      if (opts === true) {
        opts = {};
      }
      var camelToHungarian = $.fn.dataTable.camelToHungarian;
      if (camelToHungarian) {
        camelToHungarian(ColReorder.defaults, ColReorder.defaults, true);
        camelToHungarian(ColReorder.defaults, opts || {});
      }
      this.s = {
        "dt": null,
        "init": $.extend(true, {}, ColReorder.defaults, opts),
        "fixed": 0,
        "fixedRight": 0,
        "reorderCallback": null,
        "mouse": {
          "startX": -1,
          "startY": -1,
          "offsetX": -1,
          "offsetY": -1,
          "target": -1,
          "targetIndex": -1,
          "fromIndex": -1
        },
        "aoTargets": []
      };
      this.dom = {
        "drag": null,
        "pointer": null
      };
      this.s.dt = settings;
      this.s.dt._colReorder = this;
      this._fnConstruct();
      return this;
    };
    $.extend(ColReorder.prototype, {
      "fnReset": function() {
        this._fnOrderColumns(this.fnOrder());
        return this;
      },
      "fnGetCurrentOrder": function() {
        return this.fnOrder();
      },
      "fnOrder": function(set, original) {
        var a = [],
            i,
            ien,
            j,
            jen;
        var columns = this.s.dt.aoColumns;
        if (set === undefined) {
          for (i = 0, ien = columns.length; i < ien; i++) {
            a.push(columns[i]._ColReorder_iOrigCol);
          }
          return a;
        }
        if (original) {
          var order = this.fnOrder();
          for (i = 0, ien = set.length; i < ien; i++) {
            a.push($.inArray(set[i], order));
          }
          set = a;
        }
        this._fnOrderColumns(fnInvertKeyValues(set));
        return this;
      },
      fnTranspose: function(idx, dir) {
        if (!dir) {
          dir = 'toCurrent';
        }
        var order = this.fnOrder();
        var columns = this.s.dt.aoColumns;
        if (dir === 'toCurrent') {
          return !$.isArray(idx) ? $.inArray(idx, order) : $.map(idx, function(index) {
            return $.inArray(index, order);
          });
        } else {
          return !$.isArray(idx) ? columns[idx]._ColReorder_iOrigCol : $.map(idx, function(index) {
            return columns[index]._ColReorder_iOrigCol;
          });
        }
      },
      "_fnConstruct": function() {
        var that = this;
        var iLen = this.s.dt.aoColumns.length;
        var table = this.s.dt.nTable;
        var i;
        if (this.s.init.iFixedColumns) {
          this.s.fixed = this.s.init.iFixedColumns;
        }
        if (this.s.init.iFixedColumnsLeft) {
          this.s.fixed = this.s.init.iFixedColumnsLeft;
        }
        this.s.fixedRight = this.s.init.iFixedColumnsRight ? this.s.init.iFixedColumnsRight : 0;
        if (this.s.init.fnReorderCallback) {
          this.s.reorderCallback = this.s.init.fnReorderCallback;
        }
        for (i = 0; i < iLen; i++) {
          if (i > this.s.fixed - 1 && i < iLen - this.s.fixedRight) {
            this._fnMouseListener(i, this.s.dt.aoColumns[i].nTh);
          }
          this.s.dt.aoColumns[i]._ColReorder_iOrigCol = i;
        }
        this.s.dt.oApi._fnCallbackReg(this.s.dt, 'aoStateSaveParams', function(oS, oData) {
          that._fnStateSave.call(that, oData);
        }, "ColReorder_State");
        var aiOrder = null;
        if (this.s.init.aiOrder) {
          aiOrder = this.s.init.aiOrder.slice();
        }
        if (this.s.dt.oLoadedState && typeof this.s.dt.oLoadedState.ColReorder != 'undefined' && this.s.dt.oLoadedState.ColReorder.length == this.s.dt.aoColumns.length) {
          aiOrder = this.s.dt.oLoadedState.ColReorder;
        }
        if (aiOrder) {
          if (!that.s.dt._bInitComplete) {
            var bDone = false;
            $(table).on('draw.dt.colReorder', function() {
              if (!that.s.dt._bInitComplete && !bDone) {
                bDone = true;
                var resort = fnInvertKeyValues(aiOrder);
                that._fnOrderColumns.call(that, resort);
              }
            });
          } else {
            var resort = fnInvertKeyValues(aiOrder);
            that._fnOrderColumns.call(that, resort);
          }
        } else {
          this._fnSetColumnIndexes();
        }
        $(table).on('destroy.dt.colReorder', function() {
          $(table).off('destroy.dt.colReorder draw.dt.colReorder');
          $(that.s.dt.nTHead).find('*').off('.ColReorder');
          $.each(that.s.dt.aoColumns, function(i, column) {
            $(column.nTh).removeAttr('data-column-index');
          });
          that.s.dt._colReorder = null;
          that.s = null;
        });
      },
      "_fnOrderColumns": function(a) {
        var changed = false;
        if (a.length != this.s.dt.aoColumns.length) {
          this.s.dt.oInstance.oApi._fnLog(this.s.dt, 1, "ColReorder - array reorder does not " + "match known number of columns. Skipping.");
          return;
        }
        for (var i = 0,
            iLen = a.length; i < iLen; i++) {
          var currIndex = $.inArray(i, a);
          if (i != currIndex) {
            fnArraySwitch(a, currIndex, i);
            this.s.dt.oInstance.fnColReorder(currIndex, i, true, false);
            changed = true;
          }
        }
        $.fn.dataTable.Api(this.s.dt).rows().invalidate();
        this._fnSetColumnIndexes();
        if (!changed) {
          return;
        }
        if (this.s.dt.oScroll.sX !== "" || this.s.dt.oScroll.sY !== "") {
          this.s.dt.oInstance.fnAdjustColumnSizing(false);
        }
        this.s.dt.oInstance.oApi._fnSaveState(this.s.dt);
        if (this.s.reorderCallback !== null) {
          this.s.reorderCallback.call(this);
        }
      },
      "_fnStateSave": function(oState) {
        var i,
            iLen,
            aCopy,
            iOrigColumn;
        var oSettings = this.s.dt;
        var columns = oSettings.aoColumns;
        oState.ColReorder = [];
        if (oState.aaSorting) {
          for (i = 0; i < oState.aaSorting.length; i++) {
            oState.aaSorting[i][0] = columns[oState.aaSorting[i][0]]._ColReorder_iOrigCol;
          }
          var aSearchCopy = $.extend(true, [], oState.aoSearchCols);
          for (i = 0, iLen = columns.length; i < iLen; i++) {
            iOrigColumn = columns[i]._ColReorder_iOrigCol;
            oState.aoSearchCols[iOrigColumn] = aSearchCopy[i];
            oState.abVisCols[iOrigColumn] = columns[i].bVisible;
            oState.ColReorder.push(iOrigColumn);
          }
        } else if (oState.order) {
          for (i = 0; i < oState.order.length; i++) {
            oState.order[i][0] = columns[oState.order[i][0]]._ColReorder_iOrigCol;
          }
          var stateColumnsCopy = $.extend(true, [], oState.columns);
          for (i = 0, iLen = columns.length; i < iLen; i++) {
            iOrigColumn = columns[i]._ColReorder_iOrigCol;
            oState.columns[iOrigColumn] = stateColumnsCopy[i];
            oState.ColReorder.push(iOrigColumn);
          }
        }
      },
      "_fnMouseListener": function(i, nTh) {
        var that = this;
        $(nTh).on('mousedown.ColReorder', function(e) {
          e.preventDefault();
          that._fnMouseDown.call(that, e, nTh);
        });
      },
      "_fnMouseDown": function(e, nTh) {
        var that = this;
        var target = $(e.target).closest('th, td');
        var offset = target.offset();
        var idx = parseInt($(nTh).attr('data-column-index'), 10);
        if (idx === undefined) {
          return;
        }
        this.s.mouse.startX = e.pageX;
        this.s.mouse.startY = e.pageY;
        this.s.mouse.offsetX = e.pageX - offset.left;
        this.s.mouse.offsetY = e.pageY - offset.top;
        this.s.mouse.target = this.s.dt.aoColumns[idx].nTh;
        this.s.mouse.targetIndex = idx;
        this.s.mouse.fromIndex = idx;
        this._fnRegions();
        $(document).on('mousemove.ColReorder', function(e) {
          that._fnMouseMove.call(that, e);
        }).on('mouseup.ColReorder', function(e) {
          that._fnMouseUp.call(that, e);
        });
      },
      "_fnMouseMove": function(e) {
        var that = this;
        if (this.dom.drag === null) {
          if (Math.pow(Math.pow(e.pageX - this.s.mouse.startX, 2) + Math.pow(e.pageY - this.s.mouse.startY, 2), 0.5) < 5) {
            return;
          }
          this._fnCreateDragNode();
        }
        this.dom.drag.css({
          left: e.pageX - this.s.mouse.offsetX,
          top: e.pageY - this.s.mouse.offsetY
        });
        var bSet = false;
        var lastToIndex = this.s.mouse.toIndex;
        for (var i = 1,
            iLen = this.s.aoTargets.length; i < iLen; i++) {
          if (e.pageX < this.s.aoTargets[i - 1].x + ((this.s.aoTargets[i].x - this.s.aoTargets[i - 1].x) / 2)) {
            this.dom.pointer.css('left', this.s.aoTargets[i - 1].x);
            this.s.mouse.toIndex = this.s.aoTargets[i - 1].to;
            bSet = true;
            break;
          }
        }
        if (!bSet) {
          this.dom.pointer.css('left', this.s.aoTargets[this.s.aoTargets.length - 1].x);
          this.s.mouse.toIndex = this.s.aoTargets[this.s.aoTargets.length - 1].to;
        }
        if (this.s.init.bRealtime && lastToIndex !== this.s.mouse.toIndex) {
          this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex, this.s.mouse.toIndex, false);
          this.s.mouse.fromIndex = this.s.mouse.toIndex;
          this._fnRegions();
        }
      },
      "_fnMouseUp": function(e) {
        var that = this;
        $(document).off('mousemove.ColReorder mouseup.ColReorder');
        if (this.dom.drag !== null) {
          this.dom.drag.remove();
          this.dom.pointer.remove();
          this.dom.drag = null;
          this.dom.pointer = null;
          this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex, this.s.mouse.toIndex, true);
          this._fnSetColumnIndexes();
          if (this.s.dt.oScroll.sX !== "" || this.s.dt.oScroll.sY !== "") {
            this.s.dt.oInstance.fnAdjustColumnSizing(false);
          }
          this.s.dt.oInstance.oApi._fnSaveState(this.s.dt);
          if (this.s.reorderCallback !== null) {
            this.s.reorderCallback.call(this);
          }
        }
      },
      "_fnRegions": function() {
        var aoColumns = this.s.dt.aoColumns;
        this.s.aoTargets.splice(0, this.s.aoTargets.length);
        this.s.aoTargets.push({
          "x": $(this.s.dt.nTable).offset().left,
          "to": 0
        });
        var iToPoint = 0;
        var total = this.s.aoTargets[0].x;
        for (var i = 0,
            iLen = aoColumns.length; i < iLen; i++) {
          if (i != this.s.mouse.fromIndex) {
            iToPoint++;
          }
          if (aoColumns[i].bVisible && aoColumns[i].nTh.style.display !== 'none') {
            total += $(aoColumns[i].nTh).outerWidth();
            this.s.aoTargets.push({
              "x": total,
              "to": iToPoint
            });
          }
        }
        if (this.s.fixedRight !== 0) {
          this.s.aoTargets.splice(this.s.aoTargets.length - this.s.fixedRight);
        }
        if (this.s.fixed !== 0) {
          this.s.aoTargets.splice(0, this.s.fixed);
        }
      },
      "_fnCreateDragNode": function() {
        var scrolling = this.s.dt.oScroll.sX !== "" || this.s.dt.oScroll.sY !== "";
        var origCell = this.s.dt.aoColumns[this.s.mouse.targetIndex].nTh;
        var origTr = origCell.parentNode;
        var origThead = origTr.parentNode;
        var origTable = origThead.parentNode;
        var cloneCell = $(origCell).clone();
        this.dom.drag = $(origTable.cloneNode(false)).addClass('DTCR_clonedTable').append($(origThead.cloneNode(false)).append($(origTr.cloneNode(false)).append(cloneCell[0]))).css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: $(origCell).outerWidth(),
          height: $(origCell).outerHeight()
        }).appendTo('body');
        this.dom.pointer = $('<div></div>').addClass('DTCR_pointer').css({
          position: 'absolute',
          top: scrolling ? $('div.dataTables_scroll', this.s.dt.nTableWrapper).offset().top : $(this.s.dt.nTable).offset().top,
          height: scrolling ? $('div.dataTables_scroll', this.s.dt.nTableWrapper).height() : $(this.s.dt.nTable).height()
        }).appendTo('body');
      },
      "_fnSetColumnIndexes": function() {
        $.each(this.s.dt.aoColumns, function(i, column) {
          $(column.nTh).attr('data-column-index', i);
        });
      }
    });
    ColReorder.defaults = {
      aiOrder: null,
      bRealtime: true,
      iFixedColumnsLeft: 0,
      iFixedColumnsRight: 0,
      fnReorderCallback: null
    };
    ColReorder.version = "1.3.2";
    $.fn.dataTable.ColReorder = ColReorder;
    $.fn.DataTable.ColReorder = ColReorder;
    if (typeof $.fn.dataTable == "function" && typeof $.fn.dataTableExt.fnVersionCheck == "function" && $.fn.dataTableExt.fnVersionCheck('1.10.8')) {
      $.fn.dataTableExt.aoFeatures.push({
        "fnInit": function(settings) {
          var table = settings.oInstance;
          if (!settings._colReorder) {
            var dtInit = settings.oInit;
            var opts = dtInit.colReorder || dtInit.oColReorder || {};
            new ColReorder(settings, opts);
          } else {
            table.oApi._fnLog(settings, 1, "ColReorder attempted to initialise twice. Ignoring second");
          }
          return null;
        },
        "cFeature": "R",
        "sFeature": "ColReorder"
      });
    } else {
      alert("Warning: ColReorder requires DataTables 1.10.8 or greater - www.datatables.net/download");
    }
    $(document).on('preInit.dt.colReorder', function(e, settings) {
      if (e.namespace !== 'dt') {
        return;
      }
      var init = settings.oInit.colReorder;
      var defaults = DataTable.defaults.colReorder;
      if (init || defaults) {
        var opts = $.extend({}, init, defaults);
        if (init !== false) {
          new ColReorder(settings, opts);
        }
      }
    });
    $.fn.dataTable.Api.register('colReorder.reset()', function() {
      return this.iterator('table', function(ctx) {
        ctx._colReorder.fnReset();
      });
    });
    $.fn.dataTable.Api.register('colReorder.order()', function(set, original) {
      if (set) {
        return this.iterator('table', function(ctx) {
          ctx._colReorder.fnOrder(set, original);
        });
      }
      return this.context.length ? this.context[0]._colReorder.fnOrder() : null;
    });
    $.fn.dataTable.Api.register('colReorder.transpose()', function(idx, dir) {
      return this.context.length && this.context[0]._colReorder ? this.context[0]._colReorder.fnTranspose(idx, dir) : idx;
    });
    return ColReorder;
  }));
})(require('process'));
