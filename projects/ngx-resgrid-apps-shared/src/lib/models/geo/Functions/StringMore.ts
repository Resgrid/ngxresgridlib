/**
 * String functions
 *
 * @author    clemdesign <contact@clemdesign.fr>
 * @license   https://opensource.org/licenses/MIT
 * @link
  */

 export class StringMore {
    /**
     * Convert a number into specific format
     * http://locutus.io/php/strings/number_format/
     *
     * @param {number} number
     * @param {number} decimals
     * @param {string} decPoint
     * @param {string} thousandsSep
     * @returns {string}
     */
    static number_format(number: number, decimals: number, decPoint: string, thousandsSep: string): string { // eslint-disable-line camelcase
      //  discuss at: http://locutus.io/php/number_format/
      // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
      // improved by: Kevin van Zonneveld (http://kvz.io)
      // improved by: davook
      // improved by: Brett Zamir (http://brett-zamir.me)
      // improved by: Brett Zamir (http://brett-zamir.me)
      // improved by: Theriault (https://github.com/Theriault)
      // improved by: Kevin van Zonneveld (http://kvz.io)
      // bugfixed by: Michael White (http://getsprink.com)
      // bugfixed by: Benjamin Lupton
      // bugfixed by: Allan Jensen (http://www.winternet.no)
      // bugfixed by: Howard Yeend
      // bugfixed by: Diogo Resende
      // bugfixed by: Rival
      // bugfixed by: Brett Zamir (http://brett-zamir.me)
      //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
      //  revised by: Luke Smith (http://lucassmith.name)
      //    input by: Kheang Hok Chin (http://www.distantia.ca/)
      //    input by: Jay Klehr
      //    input by: Amir Habibi (http://www.residence-mixte.com/)
      //    input by: Amirouche
      //   example 1: number_format(1234.56)
      //   returns 1: '1,235'
      //   example 2: number_format(1234.56, 2, ',', ' ')
      //   returns 2: '1 234,56'
      //   example 3: number_format(1234.5678, 2, '.', '')
      //   returns 3: '1234.57'
      //   example 4: number_format(67, 2, ',', '.')
      //   returns 4: '67,00'
      //   example 5: number_format(1000)
      //   returns 5: '1,000'
      //   example 6: number_format(67.311, 2)
      //   returns 6: '67.31'
      //   example 7: number_format(1000.55, 1)
      //   returns 7: '1,000.6'
      //   example 8: number_format(67000, 5, ',', '.')
      //   returns 8: '67.000,00000'
      //   example 9: number_format(0.9, 0)
      //   returns 9: '1'
      //  example 10: number_format('1.20', 2)
      //  returns 10: '1.20'
      //  example 11: number_format('1.20', 4)
      //  returns 11: '1.2000'
      //  example 12: number_format('1.2000', 3)
      //  returns 12: '1.200'
      //  example 13: number_format('1 000,50', 2, '.', ' ')
      //  returns 13: '100 050.00'
      //  example 14: number_format(1e-8, 8, '.', '')
      //  returns 14: '0.00000001'
      let number_str = (number + '').replace(/[^0-9+\-Ee.]/g, '');
      let n = !isFinite(+number_str) ? 0 : +number_str;
      let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
      let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;
      let dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
      let toFixedFix = function (n: number, prec: number): string {
        let k = Math.pow(10, prec);
        return '' + (Math.round(n * k) / k)
          .toFixed(prec);
      };
      // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
      let s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
    }
  
    /**
     * Pad a string to number
     * Examples:
     * pad(10, 4);      // 0010
     * pad(9, 4);       // 0009
     * pad(123, 4);     // 0123
     * pad(10, 4, '-'); // --10
     *
     * @param {string} n
     * @param {number} width
     * @param {string} z
     * @returns {string}
     */
    static pad(n: number, width: number, z: string = '0'): string {
      let n_str = n + '';
      return n_str.length >= width ? n_str : new Array(width - n_str.length + 1).join(z) + n_str;
    }
  
  }