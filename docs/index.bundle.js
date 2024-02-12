/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/json-with-bigint/json-with-bigint.js":
/*!***********************************************************!*\
  !*** ./node_modules/json-with-bigint/json-with-bigint.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JSONParse: () => (/* binding */ JSONParse),
/* harmony export */   JSONStringify: () => (/* binding */ JSONStringify)
/* harmony export */ });
/* 
  Function to serialize data to JSON string
  Converts BigInt values to custom format (strings with digits and "n" at the end) and then converts them to proper big integers in JSON string
*/
const JSONStringify = (data) => {
  const bigInts = /([\[:])?"(\d+)n"([,\}\]])/g;
  const preliminaryJSON = JSON.stringify(data, (_, value) =>
    typeof value === "bigint" ? value.toString() + "n" : value
  );
  const finalJSON = preliminaryJSON.replace(bigInts, "$1$2$3");

  return finalJSON;
};

/* 
  Function to parse JSON
  If JSON has values presented in a lib's custom format (strings with digits and "n" character at the end), we just parse them to BigInt values (for backward compatibility with previous versions of the lib)
  If JSON has values greater than Number.MAX_SAFE_INTEGER, we convert those values to our custom format, then parse them to BigInt values.
  Other types of values are not affected and parsed as native JSON.parse() would parse them.

  Big numbers are found and marked using RegEx with these conditions:
    - Before the match there's : OR :[ OR :[anyNumberOf(anyCharacters)
    - The match itself has more than 16 digits OR (16 digits and any digit of the number is greater than that of the Number.MAX_SAFE_INTEGER)
    - After the match there's , OR } OR ]
*/
const JSONParse = (json) => {
  const numbersBiggerThanMaxInt =
    /(?<=:|:\[|:\[.*)(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))(?=[,\}\]])/g;
  const serializedData = json.replace(numbersBiggerThanMaxInt, '"$1n"');

  return JSON.parse(serializedData, (_, value) => {
    const isCustomFormatBigInt =
      typeof value === "string" && value.match(/^\d+n$/);

    if (isCustomFormatBigInt)
      return BigInt(value.substring(0, value.length - 1));

    return value;
  });
};


/***/ }),

/***/ "./node_modules/pako/dist/pako.esm.mjs":
/*!*********************************************!*\
  !*** ./node_modules/pako/dist/pako.esm.mjs ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Deflate: () => (/* binding */ Deflate_1),
/* harmony export */   Inflate: () => (/* binding */ Inflate_1),
/* harmony export */   constants: () => (/* binding */ constants_1),
/* harmony export */   "default": () => (/* binding */ pako),
/* harmony export */   deflate: () => (/* binding */ deflate_1),
/* harmony export */   deflateRaw: () => (/* binding */ deflateRaw_1),
/* harmony export */   gzip: () => (/* binding */ gzip_1),
/* harmony export */   inflate: () => (/* binding */ inflate_1),
/* harmony export */   inflateRaw: () => (/* binding */ inflateRaw_1),
/* harmony export */   ungzip: () => (/* binding */ ungzip_1)
/* harmony export */ });

/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

/* Public constants ==========================================================*/
/* ===========================================================================*/


//const Z_FILTERED          = 1;
//const Z_HUFFMAN_ONLY      = 2;
//const Z_RLE               = 3;
const Z_FIXED$1               = 4;
//const Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
const Z_BINARY              = 0;
const Z_TEXT                = 1;
//const Z_ASCII             = 1; // = Z_TEXT
const Z_UNKNOWN$1             = 2;

/*============================================================================*/


function zero$1(buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

const STORED_BLOCK = 0;
const STATIC_TREES = 1;
const DYN_TREES    = 2;
/* The three kinds of block type */

const MIN_MATCH$1    = 3;
const MAX_MATCH$1    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

const LENGTH_CODES$1  = 29;
/* number of length codes, not counting the special END_BLOCK code */

const LITERALS$1      = 256;
/* number of literal bytes 0..255 */

const L_CODES$1       = LITERALS$1 + 1 + LENGTH_CODES$1;
/* number of Literal or Length codes, including the END_BLOCK code */

const D_CODES$1       = 30;
/* number of distance codes */

const BL_CODES$1      = 19;
/* number of codes used to transfer the bit lengths */

const HEAP_SIZE$1     = 2 * L_CODES$1 + 1;
/* maximum heap size */

const MAX_BITS$1      = 15;
/* All codes must not exceed MAX_BITS bits */

const Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

const MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

const END_BLOCK   = 256;
/* end of block literal code */

const REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

const REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

const REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
const extra_lbits =   /* extra bits for each length code */
  new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]);

const extra_dbits =   /* extra bits for each distance code */
  new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);

const extra_blbits =  /* extra bits for each bit length code */
  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]);

const bl_order =
  new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

const DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
const static_ltree  = new Array((L_CODES$1 + 2) * 2);
zero$1(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

const static_dtree  = new Array(D_CODES$1 * 2);
zero$1(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

const _dist_code    = new Array(DIST_CODE_LEN);
zero$1(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

const _length_code  = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
zero$1(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

const base_length   = new Array(LENGTH_CODES$1);
zero$1(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

const base_dist     = new Array(D_CODES$1);
zero$1(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


let static_l_desc;
let static_d_desc;
let static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



const d_code = (dist) => {

  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
};


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
const put_short = (s, w) => {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
};


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
const send_bits = (s, value, length) => {

  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
};


const send_code = (s, c, tree) => {

  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
};


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
const bi_reverse = (code, len) => {

  let res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
};


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
const bi_flush = (s) => {

  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
};


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
const gen_bitlen = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */

  const tree            = desc.dyn_tree;
  const max_code        = desc.max_code;
  const stree           = desc.stat_desc.static_tree;
  const has_stree       = desc.stat_desc.has_stree;
  const extra           = desc.stat_desc.extra_bits;
  const base            = desc.stat_desc.extra_base;
  const max_length      = desc.stat_desc.max_length;
  let h;              /* heap index */
  let n, m;           /* iterate over the tree elements */
  let bits;           /* bit length */
  let xbits;          /* extra bits */
  let f;              /* frequency */
  let overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Tracev((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
};


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
const gen_codes = (tree, max_code, bl_count) => {
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */

  const next_code = new Array(MAX_BITS$1 + 1); /* next code value for each bit length */
  let code = 0;              /* running code value */
  let bits;                  /* bit index */
  let n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS$1; bits++) {
    code = (code + bl_count[bits - 1]) << 1;
    next_code[bits] = code;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    let len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
};


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
const tr_static_init = () => {

  let n;        /* iterates over tree elements */
  let bits;     /* bit counter */
  let length;   /* length value */
  let code;     /* code value */
  let dist;     /* distance index */
  const bl_count = new Array(MAX_BITS$1 + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES$1; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS$1; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES$1 + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES$1; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES$1, MAX_BITS$1);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES$1, MAX_BL_BITS);

  //static_init_done = true;
};


/* ===========================================================================
 * Initialize a new block.
 */
const init_block = (s) => {

  let n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES$1;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES$1;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES$1; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.sym_next = s.matches = 0;
};


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
const bi_windup = (s) =>
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
};

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
const smaller = (tree, n, m, depth) => {

  const _n2 = n * 2;
  const _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
};

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
const pqdownheap = (s, tree, k) => {
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */

  const v = s.heap[k];
  let j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
};


// inlined manually
// const SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
const compress_block = (s, ltree, dtree) => {
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */

  let dist;           /* distance of matched string */
  let lc;             /* match length or unmatched char (if dist == 0) */
  let sx = 0;         /* running index in sym_buf */
  let code;           /* the code to send */
  let extra;          /* number of extra bits to send */

  if (s.sym_next !== 0) {
    do {
      dist = s.pending_buf[s.sym_buf + sx++] & 0xff;
      dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8;
      lc = s.pending_buf[s.sym_buf + sx++];
      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS$1 + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and sym_buf is ok: */
      //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");

    } while (sx < s.sym_next);
  }

  send_code(s, END_BLOCK, ltree);
};


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
const build_tree = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */

  const tree     = desc.dyn_tree;
  const stree    = desc.stat_desc.static_tree;
  const has_stree = desc.stat_desc.has_stree;
  const elems    = desc.stat_desc.elems;
  let n, m;          /* iterate over heap elements */
  let max_code = -1; /* largest code with non zero frequency */
  let node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE$1;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
};


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
const scan_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
const send_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
const build_bl_tree = (s) => {

  let max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
};


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
const send_all_trees = (s, lcodes, dcodes, blcodes) => {
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */

  let rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
};


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "block list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
const detect_data_type = (s) => {
  /* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  let block_mask = 0xf3ffc07f;
  let n;

  /* Check for non-textual ("block-listed") bytes. */
  for (n = 0; n <= 31; n++, block_mask >>>= 1) {
    if ((block_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("allow-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS$1; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
};


let static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
const _tr_init$1 = (s) =>
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
};


/* ===========================================================================
 * Send a stored block
 */
const _tr_stored_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  bi_windup(s);        /* align on byte boundary */
  put_short(s, stored_len);
  put_short(s, ~stored_len);
  if (stored_len) {
    s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
  }
  s.pending += stored_len;
};


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
const _tr_align$1 = (s) => {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
};


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and write out the encoded block.
 */
const _tr_flush_block$1 = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  let opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  let max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN$1) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->sym_next / 3));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block$1(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
};

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
const _tr_tally$1 = (s, dist, lc) => {
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */

  s.pending_buf[s.sym_buf + s.sym_next++] = dist;
  s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
  s.pending_buf[s.sym_buf + s.sym_next++] = lc;
  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

  return (s.sym_next === s.sym_end);
};

var _tr_init_1  = _tr_init$1;
var _tr_stored_block_1 = _tr_stored_block$1;
var _tr_flush_block_1  = _tr_flush_block$1;
var _tr_tally_1 = _tr_tally$1;
var _tr_align_1 = _tr_align$1;

var trees = {
	_tr_init: _tr_init_1,
	_tr_stored_block: _tr_stored_block_1,
	_tr_flush_block: _tr_flush_block_1,
	_tr_tally: _tr_tally_1,
	_tr_align: _tr_align_1
};

// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const adler32 = (adler, buf, len, pos) => {
  let s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
};


var adler32_1 = adler32;

// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
const makeTable = () => {
  let c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
};

// Create table on load. Just 255 signed longs. Not a problem.
const crcTable = new Uint32Array(makeTable());


const crc32 = (crc, buf, len, pos) => {
  const t = crcTable;
  const end = pos + len;

  crc ^= -1;

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
};


var crc32_1 = crc32;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var messages = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

var constants$2 = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  Z_MEM_ERROR:       -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;




/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$2, Z_PARTIAL_FLUSH, Z_FULL_FLUSH: Z_FULL_FLUSH$1, Z_FINISH: Z_FINISH$3, Z_BLOCK: Z_BLOCK$1,
  Z_OK: Z_OK$3, Z_STREAM_END: Z_STREAM_END$3, Z_STREAM_ERROR: Z_STREAM_ERROR$2, Z_DATA_ERROR: Z_DATA_ERROR$2, Z_BUF_ERROR: Z_BUF_ERROR$1,
  Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
  Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
  Z_UNKNOWN,
  Z_DEFLATED: Z_DEFLATED$2
} = constants$2;

/*============================================================================*/


const MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
const MAX_WBITS$1 = 15;
/* 32K LZ77 window */
const DEF_MEM_LEVEL = 8;


const LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
const LITERALS      = 256;
/* number of literal bytes 0..255 */
const L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
const D_CODES       = 30;
/* number of distance codes */
const BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
const HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
const MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

const MIN_MATCH = 3;
const MAX_MATCH = 258;
const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

const PRESET_DICT = 0x20;

const INIT_STATE    =  42;    /* zlib header -> BUSY_STATE */
//#ifdef GZIP
const GZIP_STATE    =  57;    /* gzip header -> BUSY_STATE | EXTRA_STATE */
//#endif
const EXTRA_STATE   =  69;    /* gzip extra block -> NAME_STATE */
const NAME_STATE    =  73;    /* gzip file name -> COMMENT_STATE */
const COMMENT_STATE =  91;    /* gzip comment -> HCRC_STATE */
const HCRC_STATE    = 103;    /* gzip header CRC -> BUSY_STATE */
const BUSY_STATE    = 113;    /* deflate -> FINISH_STATE */
const FINISH_STATE  = 666;    /* stream complete */

const BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
const BS_BLOCK_DONE     = 2; /* block flush performed */
const BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
const BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

const OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

const err = (strm, errorCode) => {
  strm.msg = messages[errorCode];
  return errorCode;
};

const rank = (f) => {
  return ((f) * 2) - ((f) > 4 ? 9 : 0);
};

const zero = (buf) => {
  let len = buf.length; while (--len >= 0) { buf[len] = 0; }
};

/* ===========================================================================
 * Slide the hash table when sliding the window down (could be avoided with 32
 * bit values at the expense of memory usage). We slide even when level == 0 to
 * keep the hash table consistent if we switch back to level > 0 later.
 */
const slide_hash = (s) => {
  let n, m;
  let p;
  let wsize = s.w_size;

  n = s.hash_size;
  p = n;
  do {
    m = s.head[--p];
    s.head[p] = (m >= wsize ? m - wsize : 0);
  } while (--n);
  n = wsize;
//#ifndef FASTEST
  p = n;
  do {
    m = s.prev[--p];
    s.prev[p] = (m >= wsize ? m - wsize : 0);
    /* If n is not on any hash chain, prev[n] is garbage but
     * its value will never be used.
     */
  } while (--n);
//#endif
};

/* eslint-disable new-cap */
let HASH_ZLIB = (s, prev, data) => ((prev << s.hash_shift) ^ data) & s.hash_mask;
// This hash causes less collisions, https://github.com/nodeca/pako/issues/135
// But breaks binary compatibility
//let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
let HASH = HASH_ZLIB;


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output, except for
 * some deflate_stored() output, goes through this function so some
 * applications may wish to modify it to avoid allocating a large
 * strm->next_out buffer and copying into it. (See also read_buf()).
 */
const flush_pending = (strm) => {
  const s = strm.state;

  //_tr_flush_bits(s);
  let len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
  strm.next_out  += len;
  s.pending_out  += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending      -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
};


const flush_block_only = (s, last) => {
  _tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
};


const put_byte = (s, b) => {
  s.pending_buf[s.pending++] = b;
};


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
const putShortMSB = (s, b) => {

  //  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
};


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
const read_buf = (strm, buf, start, size) => {

  let len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32_1(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32_1(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
};


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
const longest_match = (s, cur_match) => {

  let chain_length = s.max_chain_length;      /* max hash chain length */
  let scan = s.strstart; /* current string */
  let match;                       /* matched string */
  let len;                           /* length of current match */
  let best_len = s.prev_length;              /* best match length so far */
  let nice_match = s.nice_match;             /* stop if match long enough */
  const limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  const _win = s.window; // shortcut

  const wmask = s.w_mask;
  const prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  const strend = s.strstart + MAX_MATCH;
  let scan_end1  = _win[scan + best_len - 1];
  let scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
};


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
const fill_window = (s) => {

  const _w_size = s.w_size;
  let n, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
      slide_hash(s);
      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    const curr = s.strstart + s.lookahead;
//    let init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
};

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 *
 * In case deflateParams() is used to later switch to a non-zero compression
 * level, s->matches (otherwise unused when storing) keeps track of the number
 * of hash table slides to perform. If s->matches is 1, then one hash table
 * slide will be done when switching. If s->matches is 2, the maximum value
 * allowed here, then the hash table will be cleared, since two or more slides
 * is the same as a clear.
 *
 * deflate_stored() is written to minimize the number of times an input byte is
 * copied. It is most efficient with large input and output buffers, which
 * maximizes the opportunites to have a single copy from next_in to next_out.
 */
const deflate_stored = (s, flush) => {

  /* Smallest worthy block size when not flushing or finishing. By default
   * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
   * large input and output buffers, the stored block size will be larger.
   */
  let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;

  /* Copy as many min_block or larger stored blocks directly to next_out as
   * possible. If flushing, copy the remaining available input to next_out as
   * stored blocks, if there is enough space.
   */
  let len, left, have, last = 0;
  let used = s.strm.avail_in;
  do {
    /* Set len to the maximum size block that we can copy directly with the
     * available input data and output space. Set left to how much of that
     * would be copied from what's left in the window.
     */
    len = 65535/* MAX_STORED */;     /* maximum deflate stored block length */
    have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    if (s.strm.avail_out < have) {         /* need room for header */
      break;
    }
      /* maximum stored block length that will fit in avail_out: */
    have = s.strm.avail_out - have;
    left = s.strstart - s.block_start;  /* bytes left in window */
    if (len > left + s.strm.avail_in) {
      len = left + s.strm.avail_in;   /* limit len to the input */
    }
    if (len > have) {
      len = have;             /* limit len to the output */
    }

    /* If the stored block would be less than min_block in length, or if
     * unable to copy all of the available input when flushing, then try
     * copying to the window and the pending buffer instead. Also don't
     * write an empty block when flushing -- deflate() does that.
     */
    if (len < min_block && ((len === 0 && flush !== Z_FINISH$3) ||
                        flush === Z_NO_FLUSH$2 ||
                        len !== left + s.strm.avail_in)) {
      break;
    }

    /* Make a dummy stored block in pending to get the header bytes,
     * including any pending bits. This also updates the debugging counts.
     */
    last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
    _tr_stored_block(s, 0, 0, last);

    /* Replace the lengths in the dummy stored block with len. */
    s.pending_buf[s.pending - 4] = len;
    s.pending_buf[s.pending - 3] = len >> 8;
    s.pending_buf[s.pending - 2] = ~len;
    s.pending_buf[s.pending - 1] = ~len >> 8;

    /* Write the stored block header bytes. */
    flush_pending(s.strm);

//#ifdef ZLIB_DEBUG
//    /* Update debugging counts for the data about to be copied. */
//    s->compressed_len += len << 3;
//    s->bits_sent += len << 3;
//#endif

    /* Copy uncompressed bytes from the window to next_out. */
    if (left) {
      if (left > len) {
        left = len;
      }
      //zmemcpy(s->strm->next_out, s->window + s->block_start, left);
      s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
      s.strm.next_out += left;
      s.strm.avail_out -= left;
      s.strm.total_out += left;
      s.block_start += left;
      len -= left;
    }

    /* Copy uncompressed bytes directly from next_in to next_out, updating
     * the check value.
     */
    if (len) {
      read_buf(s.strm, s.strm.output, s.strm.next_out, len);
      s.strm.next_out += len;
      s.strm.avail_out -= len;
      s.strm.total_out += len;
    }
  } while (last === 0);

  /* Update the sliding window with the last s->w_size bytes of the copied
   * data, or append all of the copied data to the existing window if less
   * than s->w_size bytes were copied. Also update the number of bytes to
   * insert in the hash tables, in the event that deflateParams() switches to
   * a non-zero compression level.
   */
  used -= s.strm.avail_in;    /* number of input bytes directly copied */
  if (used) {
    /* If any input was used, then no unused input remains in the window,
     * therefore s->block_start == s->strstart.
     */
    if (used >= s.w_size) {  /* supplant the previous history */
      s.matches = 2;     /* clear hash */
      //zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
      s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
      s.strstart = s.w_size;
      s.insert = s.strstart;
    }
    else {
      if (s.window_size - s.strstart <= used) {
        /* Slide the window down. */
        s.strstart -= s.w_size;
        //zmemcpy(s->window, s->window + s->w_size, s->strstart);
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;   /* add a pending slide_hash() */
        }
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      //zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
      s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
      s.strstart += used;
      s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
    }
    s.block_start = s.strstart;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* If the last block was written to next_out, then done. */
  if (last) {
    return BS_FINISH_DONE;
  }

  /* If flushing and all input has been consumed, then done. */
  if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 &&
    s.strm.avail_in === 0 && s.strstart === s.block_start) {
    return BS_BLOCK_DONE;
  }

  /* Fill the window with any remaining input. */
  have = s.window_size - s.strstart;
  if (s.strm.avail_in > have && s.block_start >= s.w_size) {
    /* Slide the window down. */
    s.block_start -= s.w_size;
    s.strstart -= s.w_size;
    //zmemcpy(s->window, s->window + s->w_size, s->strstart);
    s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
    if (s.matches < 2) {
      s.matches++;       /* add a pending slide_hash() */
    }
    have += s.w_size;      /* more space now */
    if (s.insert > s.strstart) {
      s.insert = s.strstart;
    }
  }
  if (have > s.strm.avail_in) {
    have = s.strm.avail_in;
  }
  if (have) {
    read_buf(s.strm, s.window, s.strstart, have);
    s.strstart += have;
    s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* There was not enough avail_out to write a complete worthy or flushed
   * stored block to next_out. Write a stored block to pending instead, if we
   * have enough input for a worthy block, or if flushing and there is enough
   * room for the remaining input as a stored block in the pending buffer.
   */
  have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    /* maximum stored block length that will fit in pending: */
  have = s.pending_buf_size - have > 65535/* MAX_STORED */ ? 65535/* MAX_STORED */ : s.pending_buf_size - have;
  min_block = have > s.w_size ? s.w_size : have;
  left = s.strstart - s.block_start;
  if (left >= min_block ||
     ((left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 &&
     s.strm.avail_in === 0 && left <= have)) {
    len = left > have ? have : left;
    last = flush === Z_FINISH$3 && s.strm.avail_in === 0 &&
         len === left ? 1 : 0;
    _tr_stored_block(s, s.block_start, len, last);
    s.block_start += len;
    flush_pending(s.strm);
  }

  /* We've done all we can with the available input and output. */
  return last ? BS_FINISH_STARTED : BS_NEED_MORE;
};


/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
const deflate_fast = (s, flush) => {

  let hash_head;        /* head of the hash chain */
  let bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
const deflate_slow = (s, flush) => {

  let hash_head;          /* head of hash chain */
  let bflush;              /* set if current block must be flushed */

  let max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
};


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
const deflate_rle = (s, flush) => {

  let bflush;            /* set if current block must be flushed */
  let prev;              /* byte at distance one to match */
  let scan, strend;      /* scan goes up to strend for length of run */

  const _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
const deflate_huff = (s, flush) => {

  let bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH$3) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {

  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

const configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
const lm_init = (s) => {

  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
};


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED$2; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new Uint16Array(HEAP_SIZE * 2);
  this.dyn_dtree  = new Uint16Array((2 * D_CODES + 1) * 2);
  this.bl_tree    = new Uint16Array((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new Uint16Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new Uint16Array(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new Uint16Array(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.sym_buf = 0;        /* buffer for distances and literals/lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.sym_next = 0;      /* running index in sym_buf */
  this.sym_end = 0;       /* symbol table full when sym_next reaches this */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


/* =========================================================================
 * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
 */
const deflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const s = strm.state;
  if (!s || s.strm !== strm || (s.status !== INIT_STATE &&
//#ifdef GZIP
                                s.status !== GZIP_STATE &&
//#endif
                                s.status !== EXTRA_STATE &&
                                s.status !== NAME_STATE &&
                                s.status !== COMMENT_STATE &&
                                s.status !== HCRC_STATE &&
                                s.status !== BUSY_STATE &&
                                s.status !== FINISH_STATE)) {
    return 1;
  }
  return 0;
};


const deflateResetKeep = (strm) => {

  if (deflateStateCheck(strm)) {
    return err(strm, Z_STREAM_ERROR$2);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  const s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status =
//#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE :
//#endif
    s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = -2;
  _tr_init(s);
  return Z_OK$3;
};


const deflateReset = (strm) => {

  const ret = deflateResetKeep(strm);
  if (ret === Z_OK$3) {
    lm_init(strm.state);
  }
  return ret;
};


const deflateSetHeader = (strm, head) => {

  if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
    return Z_STREAM_ERROR$2;
  }
  strm.state.gzhead = head;
  return Z_OK$3;
};


const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {

  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR$2;
  }
  let wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION$1) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED || (windowBits === 8 && wrap !== 1)) {
    return err(strm, Z_STREAM_ERROR$2);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  const s = new DeflateState();

  strm.state = s;
  s.strm = strm;
  s.status = INIT_STATE;     /* to pass state test in deflateReset() */

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new Uint8Array(s.w_size * 2);
  s.head = new Uint16Array(s.hash_size);
  s.prev = new Uint16Array(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  /* We overlay pending_buf and sym_buf. This works since the average size
   * for length/distance pairs over any compressed block is assured to be 31
   * bits or less.
   *
   * Analysis: The longest fixed codes are a length code of 8 bits plus 5
   * extra bits, for lengths 131 to 257. The longest fixed distance codes are
   * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
   * possible fixed-codes length/distance pair is then 31 bits total.
   *
   * sym_buf starts one-fourth of the way into pending_buf. So there are
   * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
   * in sym_buf is three bytes -- two for the distance and one for the
   * literal/length. As each symbol is consumed, the pointer to the next
   * sym_buf value to read moves forward three bytes. From that symbol, up to
   * 31 bits are written to pending_buf. The closest the written pending_buf
   * bits gets to the next sym_buf symbol to read is just before the last
   * code is written. At that time, 31*(n-2) bits have been written, just
   * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
   * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
   * symbols are written.) The closest the writing gets to what is unread is
   * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
   * can range from 128 to 32768.
   *
   * Therefore, at a minimum, there are 142 bits of space between what is
   * written and what is read in the overlain buffers, so the symbols cannot
   * be overwritten by the compressed data. That space is actually 139 bits,
   * due to the three-bit fixed-code block header.
   *
   * That covers the case where either Z_FIXED is specified, forcing fixed
   * codes, or when the use of fixed codes is chosen, because that choice
   * results in a smaller compressed block than dynamic codes. That latter
   * condition then assures that the above analysis also covers all dynamic
   * blocks. A dynamic-code block will only be chosen to be emitted if it has
   * fewer bits than a fixed-code block would for the same set of symbols.
   * Therefore its average symbol length is assured to be less than 31. So
   * the compressed data for a dynamic block also cannot overwrite the
   * symbols from which it is being constructed.
   */

  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = new Uint8Array(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->sym_buf = s->pending_buf + s->lit_bufsize;
  s.sym_buf = s.lit_bufsize;

  //s->sym_end = (s->lit_bufsize - 1) * 3;
  s.sym_end = (s.lit_bufsize - 1) * 3;
  /* We avoid equality with lit_bufsize*3 because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
};

const deflateInit = (strm, level) => {

  return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
};


/* ========================================================================= */
const deflate$2 = (strm, flush) => {

  if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
  }

  const s = strm.state;

  if (!strm.output ||
      (strm.avail_in !== 0 && !strm.input) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH$3)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
  }

  const old_flush = s.last_flush;
  s.last_flush = flush;

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK$3;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH$3) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR$1);
  }

  /* Write the header */
  if (s.status === INIT_STATE && s.wrap === 0) {
    s.status = BUSY_STATE;
  }
  if (s.status === INIT_STATE) {
    /* zlib header */
    let header = (Z_DEFLATED$2 + ((s.w_bits - 8) << 4)) << 8;
    let level_flags = -1;

    if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
      level_flags = 0;
    } else if (s.level < 6) {
      level_flags = 1;
    } else if (s.level === 6) {
      level_flags = 2;
    } else {
      level_flags = 3;
    }
    header |= (level_flags << 6);
    if (s.strstart !== 0) { header |= PRESET_DICT; }
    header += 31 - (header % 31);

    putShortMSB(s, header);

    /* Save the adler32 of the preset dictionary: */
    if (s.strstart !== 0) {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 0xffff);
    }
    strm.adler = 1; // adler32(0L, Z_NULL, 0);
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#ifdef GZIP
  if (s.status === GZIP_STATE) {
    /* gzip header */
    strm.adler = 0;  //crc32(0L, Z_NULL, 0);
    put_byte(s, 31);
    put_byte(s, 139);
    put_byte(s, 8);
    if (!s.gzhead) { // s->gzhead == Z_NULL
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, OS_CODE);
      s.status = BUSY_STATE;

      /* Compression must start with an empty pending buffer */
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    else {
      put_byte(s, (s.gzhead.text ? 1 : 0) +
                  (s.gzhead.hcrc ? 2 : 0) +
                  (!s.gzhead.extra ? 0 : 4) +
                  (!s.gzhead.name ? 0 : 8) +
                  (!s.gzhead.comment ? 0 : 16)
      );
      put_byte(s, s.gzhead.time & 0xff);
      put_byte(s, (s.gzhead.time >> 8) & 0xff);
      put_byte(s, (s.gzhead.time >> 16) & 0xff);
      put_byte(s, (s.gzhead.time >> 24) & 0xff);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, s.gzhead.os & 0xff);
      if (s.gzhead.extra && s.gzhead.extra.length) {
        put_byte(s, s.gzhead.extra.length & 0xff);
        put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
      }
      if (s.gzhead.hcrc) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
      }
      s.gzindex = 0;
      s.status = EXTRA_STATE;
    }
  }
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let left = (s.gzhead.extra.length & 0xffff) - s.gzindex;
      while (s.pending + left > s.pending_buf_size) {
        let copy = s.pending_buf_size - s.pending;
        // zmemcpy(s.pending_buf + s.pending,
        //    s.gzhead.extra + s.gzindex, copy);
        s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
        s.pending = s.pending_buf_size;
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        //---//
        s.gzindex += copy;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
        beg = 0;
        left -= copy;
      }
      // JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
      //              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
      let gzhead_extra = new Uint8Array(s.gzhead.extra);
      // zmemcpy(s->pending_buf + s->pending,
      //     s->gzhead->extra + s->gzindex, left);
      s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
      s.pending += left;
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = NAME_STATE;
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = COMMENT_STATE;
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
    }
    s.status = HCRC_STATE;
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
      put_byte(s, strm.adler & 0xff);
      put_byte(s, (strm.adler >> 8) & 0xff);
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
    }
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK$3;
    }
  }
//#endif

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE)) {
    let bstate = s.level === 0 ? deflate_stored(s, flush) :
                 s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) :
                 s.strategy === Z_RLE ? deflate_rle(s, flush) :
                 configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK$3;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        _tr_align(s);
      }
      else if (flush !== Z_BLOCK$1) { /* FULL_FLUSH or SYNC_FLUSH */

        _tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH$1) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK$3;
      }
    }
  }

  if (flush !== Z_FINISH$3) { return Z_OK$3; }
  if (s.wrap <= 0) { return Z_STREAM_END$3; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
};


const deflateEnd = (strm) => {

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const status = strm.state.status;

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
};


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
const deflateSetDictionary = (strm, dictionary) => {

  let dictLength = dictionary.length;

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR$2;
  }

  const s = strm.state;
  const wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR$2;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    let tmpDict = new Uint8Array(s.w_size);
    tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  const avail = strm.avail_in;
  const next = strm.next_in;
  const input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    let str = s.strstart;
    let n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK$3;
};


var deflateInit_1 = deflateInit;
var deflateInit2_1 = deflateInit2;
var deflateReset_1 = deflateReset;
var deflateResetKeep_1 = deflateResetKeep;
var deflateSetHeader_1 = deflateSetHeader;
var deflate_2$1 = deflate$2;
var deflateEnd_1 = deflateEnd;
var deflateSetDictionary_1 = deflateSetDictionary;
var deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
module.exports.deflateBound = deflateBound;
module.exports.deflateCopy = deflateCopy;
module.exports.deflateGetDictionary = deflateGetDictionary;
module.exports.deflateParams = deflateParams;
module.exports.deflatePending = deflatePending;
module.exports.deflatePrime = deflatePrime;
module.exports.deflateTune = deflateTune;
*/

var deflate_1$2 = {
	deflateInit: deflateInit_1,
	deflateInit2: deflateInit2_1,
	deflateReset: deflateReset_1,
	deflateResetKeep: deflateResetKeep_1,
	deflateSetHeader: deflateSetHeader_1,
	deflate: deflate_2$1,
	deflateEnd: deflateEnd_1,
	deflateSetDictionary: deflateSetDictionary_1,
	deflateInfo: deflateInfo
};

const _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var assign = function (obj /*from1, from2, from3, ...*/) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (const p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// Join array of chunks to single array.
var flattenChunks = (chunks) => {
  // calculate data length
  let len = 0;

  for (let i = 0, l = chunks.length; i < l; i++) {
    len += chunks[i].length;
  }

  // join chunks
  const result = new Uint8Array(len);

  for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
    let chunk = chunks[i];
    result.set(chunk, pos);
    pos += chunk.length;
  }

  return result;
};

var common = {
	assign: assign,
	flattenChunks: flattenChunks
};

// String encode/decode helpers


// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
let STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
const _utf8len = new Uint8Array(256);
for (let q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
var string2buf = (str) => {
  if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }

  let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new Uint8Array(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper
const buf2binstring = (buf, len) => {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }

  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};


// convert array to string
var buf2string = (buf, max) => {
  const len = max || buf.length;

  if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max));
  }

  let i, out;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  const utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    let c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    let c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
var utf8border = (buf, max) => {

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  let pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};

var strings = {
	string2buf: string2buf,
	buf2string: buf2string,
	utf8border: utf8border
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

var zstream = ZStream;

const toString$1 = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH: Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH: Z_FINISH$2,
  Z_OK: Z_OK$2, Z_STREAM_END: Z_STREAM_END$2,
  Z_DEFAULT_COMPRESSION,
  Z_DEFAULT_STRATEGY,
  Z_DEFLATED: Z_DEFLATED$1
} = constants$2;

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate$1(options) {
  this.options = common.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED$1,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY
  }, options || {});

  let opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new zstream();
  this.strm.avail_out = 0;

  let status = deflate_1$2.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK$2) {
    throw new Error(messages[status]);
  }

  if (opt.header) {
    deflate_1$2.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    let dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString$1.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = deflate_1$2.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must
 * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
 * buffers and call [[Deflate#onEnd]].
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  let status, _flush_mode;

  if (this.ended) { return false; }

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString$1.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    // Make sure avail_out > 6 to avoid repeating markers
    if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    status = deflate_1$2.deflate(strm, _flush_mode);

    // Ended => flush and finish
    if (status === Z_STREAM_END$2) {
      if (strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
      }
      status = deflate_1$2.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK$2;
    }

    // Flush if out buffer full
    if (strm.avail_out === 0) {
      this.onData(strm.output);
      continue;
    }

    // Flush if requested and has data
    if (_flush_mode > 0 && strm.next_out > 0) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array): output data.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK$2) {
    this.result = common.flattenChunks(this.chunks);
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate$1(input, options) {
  const deflator = new Deflate$1(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || messages[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return deflate$1(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip$1(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate$1(input, options);
}


var Deflate_1$1 = Deflate$1;
var deflate_2 = deflate$1;
var deflateRaw_1$1 = deflateRaw$1;
var gzip_1$1 = gzip$1;
var constants$1 = constants$2;

var deflate_1$1 = {
	Deflate: Deflate_1$1,
	deflate: deflate_2,
	deflateRaw: deflateRaw_1$1,
	gzip: gzip_1$1,
	constants: constants$1
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
const BAD$1 = 16209;       /* got a data error -- remain here until reset */
const TYPE$1 = 16191;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
var inffast = function inflate_fast(strm, start) {
  let _in;                    /* local strm.input */
  let last;                   /* have enough input while in < last */
  let _out;                   /* local strm.output */
  let beg;                    /* inflate()'s initial strm.output */
  let end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  let dmax;                   /* maximum distance from zlib header */
//#endif
  let wsize;                  /* window size or zero if not using window */
  let whave;                  /* valid bytes in the window */
  let wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  let s_window;               /* allocated sliding window, if wsize != 0 */
  let hold;                   /* local strm.hold */
  let bits;                   /* local strm.bits */
  let lcode;                  /* local strm.lencode */
  let dcode;                  /* local strm.distcode */
  let lmask;                  /* mask for first level of length codes */
  let dmask;                  /* mask for first level of distance codes */
  let here;                   /* retrieved table entry */
  let op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  let len;                    /* match length, unused bytes */
  let dist;                   /* match distance */
  let from;                   /* where to copy match from */
  let from_source;


  let input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  const state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD$1;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD$1;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD$1;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE$1;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD$1;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const MAXBITS = 15;
const ENOUGH_LENS$1 = 852;
const ENOUGH_DISTS$1 = 592;
//const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

const CODES$1 = 0;
const LENS$1 = 1;
const DISTS$1 = 2;

const lbase = new Uint16Array([ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
]);

const lext = new Uint8Array([ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
]);

const dbase = new Uint16Array([ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
]);

const dext = new Uint8Array([ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
]);

const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) =>
{
  const bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  let len = 0;               /* a code's length in bits */
  let sym = 0;               /* index of code symbols */
  let min = 0, max = 0;          /* minimum and maximum code lengths */
  let root = 0;              /* number of index bits for root table */
  let curr = 0;              /* number of index bits for current table */
  let drop = 0;              /* code bits to drop for sub-table */
  let left = 0;                   /* number of prefix codes available */
  let used = 0;              /* code entries in table used */
  let huff = 0;              /* Huffman code */
  let incr;              /* for incrementing code, index */
  let fill;              /* index for replicating entries */
  let low;               /* low bits for current root entry */
  let mask;              /* mask for low root bits */
  let next;             /* next available space in table */
  let base = null;     /* base value table to use */
//  let shoextra;    /* extra bits table to use */
  let match;                  /* use base and extra for symbol >= match */
  const count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  const offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  let extra = null;

  let here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES$1 || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES$1) {
    base = extra = work;    /* dummy value--not used */
    match = 20;

  } else if (type === LENS$1) {
    base = lbase;
    extra = lext;
    match = 257;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    match = 0;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
    (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] + 1 < match) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] >= match) {
      here_op = extra[work[sym] - match];
      here_val = base[work[sym] - match];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
        (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


var inftrees = inflate_table;

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.






const CODES = 0;
const LENS = 1;
const DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_FINISH: Z_FINISH$1, Z_BLOCK, Z_TREES,
  Z_OK: Z_OK$1, Z_STREAM_END: Z_STREAM_END$1, Z_NEED_DICT: Z_NEED_DICT$1, Z_STREAM_ERROR: Z_STREAM_ERROR$1, Z_DATA_ERROR: Z_DATA_ERROR$1, Z_MEM_ERROR: Z_MEM_ERROR$1, Z_BUF_ERROR,
  Z_DEFLATED
} = constants$2;


/* STATES ====================================================================*/
/* ===========================================================================*/


const    HEAD = 16180;       /* i: waiting for magic header */
const    FLAGS = 16181;      /* i: waiting for method and flags (gzip) */
const    TIME = 16182;       /* i: waiting for modification time (gzip) */
const    OS = 16183;         /* i: waiting for extra flags and operating system (gzip) */
const    EXLEN = 16184;      /* i: waiting for extra length (gzip) */
const    EXTRA = 16185;      /* i: waiting for extra bytes (gzip) */
const    NAME = 16186;       /* i: waiting for end of file name (gzip) */
const    COMMENT = 16187;    /* i: waiting for end of comment (gzip) */
const    HCRC = 16188;       /* i: waiting for header crc (gzip) */
const    DICTID = 16189;    /* i: waiting for dictionary check value */
const    DICT = 16190;      /* waiting for inflateSetDictionary() call */
const        TYPE = 16191;      /* i: waiting for type bits, including last-flag bit */
const        TYPEDO = 16192;    /* i: same, but skip check to exit inflate on new block */
const        STORED = 16193;    /* i: waiting for stored size (length and complement) */
const        COPY_ = 16194;     /* i/o: same as COPY below, but only first time in */
const        COPY = 16195;      /* i/o: waiting for input or output to copy stored block */
const        TABLE = 16196;     /* i: waiting for dynamic block table lengths */
const        LENLENS = 16197;   /* i: waiting for code length code lengths */
const        CODELENS = 16198;  /* i: waiting for length/lit and distance code lengths */
const            LEN_ = 16199;      /* i: same as LEN below, but only first time in */
const            LEN = 16200;       /* i: waiting for length/lit/eob code */
const            LENEXT = 16201;    /* i: waiting for length extra bits */
const            DIST = 16202;      /* i: waiting for distance code */
const            DISTEXT = 16203;   /* i: waiting for distance extra bits */
const            MATCH = 16204;     /* o: waiting for output space to copy string */
const            LIT = 16205;       /* o: waiting for output space to write literal */
const    CHECK = 16206;     /* i: waiting for 32-bit check value */
const    LENGTH = 16207;    /* i: waiting for 32-bit length (gzip) */
const    DONE = 16208;      /* finished check, done -- remain here until reset */
const    BAD = 16209;       /* got a data error -- remain here until reset */
const    MEM = 16210;       /* got an inflate() memory error -- remain here until reset */
const    SYNC = 16211;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
//const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

const MAX_WBITS = 15;
/* 32K LZ77 window */
const DEF_WBITS = MAX_WBITS;


const zswap32 = (q) => {

  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
};


function InflateState() {
  this.strm = null;           /* pointer back to this zlib stream */
  this.mode = 0;              /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip,
                                 bit 2 true to validate check value */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib), or
                                 -1 if raw or no header yet */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new Uint16Array(320); /* temporary storage for code lengths */
  this.work = new Uint16Array(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}


const inflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const state = strm.state;
  if (!state || state.strm !== strm ||
    state.mode < HEAD || state.mode > SYNC) {
    return 1;
  }
  return 0;
};


const inflateResetKeep = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.flags = -1;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
  state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK$1;
};


const inflateReset = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

};


const inflateReset2 = (strm, windowBits) => {
  let wrap;

  /* get the state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 5;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
};


const inflateInit2 = (strm, windowBits) => {

  if (!strm) { return Z_STREAM_ERROR$1; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  const state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.strm = strm;
  state.window = null/*Z_NULL*/;
  state.mode = HEAD;     /* to pass state test in inflateReset2() */
  const ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
};


const inflateInit = (strm) => {

  return inflateInit2(strm, DEF_WBITS);
};


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
let virgin = true;

let lenfix, distfix; // We have no pointers in JS, so keep tables separate


const fixedtables = (state) => {

  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    lenfix = new Int32Array(512);
    distfix = new Int32Array(32);

    /* literal/length table */
    let sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inftrees(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inftrees(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
};


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
const updatewindow = (strm, src, end, copy) => {

  let dist;
  const state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new Uint8Array(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    state.window.set(src.subarray(end - state.wsize, end), 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      state.window.set(src.subarray(end - copy, end), 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
};


const inflate$2 = (strm, flush) => {

  let state;
  let input, output;          // input/output buffers
  let next;                   /* next input INDEX */
  let put;                    /* next output INDEX */
  let have, left;             /* available input and output */
  let hold;                   /* bit buffer */
  let bits;                   /* bits in bit buffer */
  let _in, _out;              /* save starting available input and output */
  let copy;                   /* number of stored or match bytes to copy */
  let from;                   /* where to copy match bytes from */
  let from_source;
  let here = 0;               /* current decoding table entry */
  let here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //let last;                   /* parent table entry */
  let last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  let len;                    /* length to copy for repeats, bits to drop */
  let ret;                    /* return code */
  const hbuf = new Uint8Array(4);    /* buffer for gzip header crc calculation */
  let opts;

  let n; // temporary variable for NEED_BITS

  const order = /* permutation of code lengths */
    new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);


  if (inflateStateCheck(strm) || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR$1;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK$1;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          if (state.wbits === 0) {
            state.wbits = 15;
          }
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        if (len > 15 || len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }

        // !!! pako patch. Force use `options.windowBits` if passed.
        // Required to always use max window size by default.
        state.dmax = 1 << state.wbits;
        //state.dmax = 1 << len;

        state.flags = 0;               /* indicate zlib header */
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32_1(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32_1(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Uint8Array(state.head.extra_len);
              }
              state.head.extra.set(
                input.subarray(
                  next,
                  // extra field is limited to 65536 bytes
                  // - no need for additional size check
                  next + copy
                ),
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if ((state.flags & 0x0200) && (state.wrap & 4)) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32_1(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT$1;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          output.set(input.subarray(next, next + copy), put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inffast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if ((state.wrap & 4) && _out) {
            strm.adler = state.check =
                /*UPDATE_CHECK(state.check, put - _out, _out);*/
                (state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.wrap & 4) && (state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END$1;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR$1;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR$1;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR$1;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH$1))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if ((state.wrap & 4) && _out) {
    strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR;
  }
  return ret;
};


const inflateEnd = (strm) => {

  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR$1;
  }

  let state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
};


const inflateGetHeader = (strm, head) => {

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  const state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR$1; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK$1;
};


const inflateSetDictionary = (strm, dictionary) => {
  const dictLength = dictionary.length;

  let state;
  let dictid;
  let ret;

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32_1(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR$1;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK$1;
};


var inflateReset_1 = inflateReset;
var inflateReset2_1 = inflateReset2;
var inflateResetKeep_1 = inflateResetKeep;
var inflateInit_1 = inflateInit;
var inflateInit2_1 = inflateInit2;
var inflate_2$1 = inflate$2;
var inflateEnd_1 = inflateEnd;
var inflateGetHeader_1 = inflateGetHeader;
var inflateSetDictionary_1 = inflateSetDictionary;
var inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
module.exports.inflateCodesUsed = inflateCodesUsed;
module.exports.inflateCopy = inflateCopy;
module.exports.inflateGetDictionary = inflateGetDictionary;
module.exports.inflateMark = inflateMark;
module.exports.inflatePrime = inflatePrime;
module.exports.inflateSync = inflateSync;
module.exports.inflateSyncPoint = inflateSyncPoint;
module.exports.inflateUndermine = inflateUndermine;
module.exports.inflateValidate = inflateValidate;
*/

var inflate_1$2 = {
	inflateReset: inflateReset_1,
	inflateReset2: inflateReset2_1,
	inflateResetKeep: inflateResetKeep_1,
	inflateInit: inflateInit_1,
	inflateInit2: inflateInit2_1,
	inflate: inflate_2$1,
	inflateEnd: inflateEnd_1,
	inflateGetHeader: inflateGetHeader_1,
	inflateSetDictionary: inflateSetDictionary_1,
	inflateInfo: inflateInfo
};

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

var gzheader = GZheader;

const toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH, Z_FINISH,
  Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR
} = constants$2;

/* ===========================================================================*/


/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate$1(options) {
  this.options = common.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ''
  }, options || {});

  const opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new zstream();
  this.strm.avail_out = 0;

  let status  = inflate_1$2.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== Z_OK) {
    throw new Error(messages[status]);
  }

  this.header = new gzheader();

  inflate_1$2.inflateGetHeader(this.strm, this.header);

  // Setup dictionary
  if (opt.dictionary) {
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) { //In raw mode we need to set the dictionary early
      status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(messages[status]);
      }
    }
  }
}

/**
 * Inflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer): input data
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
 *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
 *   `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. If end of stream detected,
 * [[Inflate#onEnd]] will be called.
 *
 * `flush_mode` is not needed for normal operation, because end of stream
 * detected automatically. You may try to use it for advanced things, but
 * this functionality was not tested.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate$1.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  const dictionary = this.options.dictionary;
  let status, _flush_mode, last_avail_out;

  if (this.ended) return false;

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

  // Convert data if needed
  if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = inflate_1$2.inflate(strm, _flush_mode);

    if (status === Z_NEED_DICT && dictionary) {
      status = inflate_1$2.inflateSetDictionary(strm, dictionary);

      if (status === Z_OK) {
        status = inflate_1$2.inflate(strm, _flush_mode);
      } else if (status === Z_DATA_ERROR) {
        // Replace code with more verbose
        status = Z_NEED_DICT;
      }
    }

    // Skip snyc markers if more data follows and not raw mode
    while (strm.avail_in > 0 &&
           status === Z_STREAM_END &&
           strm.state.wrap > 0 &&
           data[strm.next_in] !== 0)
    {
      inflate_1$2.inflateReset(strm);
      status = inflate_1$2.inflate(strm, _flush_mode);
    }

    switch (status) {
      case Z_STREAM_ERROR:
      case Z_DATA_ERROR:
      case Z_NEED_DICT:
      case Z_MEM_ERROR:
        this.onEnd(status);
        this.ended = true;
        return false;
    }

    // Remember real `avail_out` value, because we may patch out buffer content
    // to align utf8 strings boundaries.
    last_avail_out = strm.avail_out;

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === Z_STREAM_END) {

        if (this.options.to === 'string') {

          let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          let tail = strm.next_out - next_out_utf8;
          let utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail & realign counters
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);

          this.onData(utf8str);

        } else {
          this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
        }
      }
    }

    // Must repeat iteration if out buffer is full
    if (status === Z_OK && last_avail_out === 0) continue;

    // Finalize if end of stream reached.
    if (status === Z_STREAM_END) {
      status = inflate_1$2.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return true;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|String): output data. When string output requested,
 *   each chunk will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate$1.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate$1.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = common.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako');
 * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
 * let output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err) {
 *   console.log(err);
 * }
 * ```
 **/
function inflate$1(input, options) {
  const inflator = new Inflate$1(options);

  inflator.push(input);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) throw inflator.msg || messages[inflator.err];

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw$1(input, options) {
  options = options || {};
  options.raw = true;
  return inflate$1(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


var Inflate_1$1 = Inflate$1;
var inflate_2 = inflate$1;
var inflateRaw_1$1 = inflateRaw$1;
var ungzip$1 = inflate$1;
var constants = constants$2;

var inflate_1$1 = {
	Inflate: Inflate_1$1,
	inflate: inflate_2,
	inflateRaw: inflateRaw_1$1,
	ungzip: ungzip$1,
	constants: constants
};

const { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;

const { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;



var Deflate_1 = Deflate;
var deflate_1 = deflate;
var deflateRaw_1 = deflateRaw;
var gzip_1 = gzip;
var Inflate_1 = Inflate;
var inflate_1 = inflate;
var inflateRaw_1 = inflateRaw;
var ungzip_1 = ungzip;
var constants_1 = constants$2;

var pako = {
	Deflate: Deflate_1,
	deflate: deflate_1,
	deflateRaw: deflateRaw_1,
	gzip: gzip_1,
	Inflate: Inflate_1,
	inflate: inflate_1,
	inflateRaw: inflateRaw_1,
	ungzip: ungzip_1,
	constants: constants_1
};




/***/ }),

/***/ "./src/breeding.js":
/*!*************************!*\
  !*** ./src/breeding.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loader */ "./src/loader.js");
/* harmony import */ var _palstats__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./palstats */ "./src/palstats.js");
/* harmony import */ var _breedpairs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./breedpairs */ "./src/breedpairs.js");
// Things we want
// 1. Search final breed result based on two parents (so we can calculate from passives) - Two Parent Search
// 2. Search final breed result based on a single parent - One Parent Search
// 3. Search most powerful result from a large set of existing pals - Optimal Search

// 4. Search most likely passives from existing pals to result ID - Specific Search
//  Upload Save, Load Pals
//  Want to choose result Pal and the passive traits we want
//  Then the algorithm will sort through the saved pals to find the traits
//      Use those pals to come up with a route to the desired pal

// Test breed path from one parent:
// Fuack cannot produce a Vixy.
// Fuack CAN produce a Foxparks, which CAN produce a Vixy




let obtainedPals = [];
const uniqueCombos = [
  "Chikipi",
  "Frostallion",
  "Jetragon",
  "Paladius",
  "Necromus",
  "Jormuntide Ignis",
]

/**
 * 
 * @param {number} id The id of the pal
 * @param {boolean} variant Is this the variant type?
 * @returns {any | undefined}
 */
function getPalById(id, variant = undefined) {
  return _palstats__WEBPACK_IMPORTED_MODULE_1__["default"].find(pal => pal.id === id
    && (variant ? pal?.variant : true));
}

/**
 * Gets a list of pals currently owned in the savefile filtered by traits
 * @param {Array | null} traits The traits to filter by
 * @returns 
 */
function getSavedPals(traits = null) {
  if (!traits || obtainedPals.length <= 0 || !traits.length || traits.length <= 0)
    return obtainedPals;

  return obtainedPals.filter(pal => {
    if (!pal.PassiveSkillList)
      return false;

    for (let i of traits)
      if (pal.PassiveSkillList.includes(i))
        return true;

    return false;
  })
}

function getPairsToResultFromName(currentName, resultName) {
  const pairNames = [];
  for (let [ mate, pairMap ] of Object.entries(_breedpairs__WEBPACK_IMPORTED_MODULE_2__["default"])) {
    for (let [ pairMate, result ] of Object.entries(pairMap)) {
      if (pairMate === currentName && result === resultName)
        pairNames.push(mate);
    }
  }

  return pairNames;
}

function findResultFromName(currentName, resultName) {
  // if it's directly bred into, return with the mate
  for (let [mate, result] of Object.entries(_breedpairs__WEBPACK_IMPORTED_MODULE_2__["default"][currentName])) {
    if (result === resultName) {
      return [{ mate, result }];
    }
  }

  for (let [firstMate, firstResult] of Object.entries(_breedpairs__WEBPACK_IMPORTED_MODULE_2__["default"][currentName])) {
    for (let [secondMate, secondResult] of Object.entries(_breedpairs__WEBPACK_IMPORTED_MODULE_2__["default"][firstResult])) {
      if (secondResult === resultName) {
        return [
          { mate: firstMate, result: firstResult },
          { mate: secondMate, result: secondResult }
        ];
      }

      for (let [thirdMate, thirdResult] of Object.entries(_breedpairs__WEBPACK_IMPORTED_MODULE_2__["default"][secondResult])) {
        if (thirdResult === resultName) {
          return [
            { mate: firstMate, result: firstResult },
            { mate: secondMate, result: secondResult },
            { mate: thirdMate, result: thirdResult }
          ];
        }

        for (let [fourthMate, fourthResult] of Object.entries(_breedpairs__WEBPACK_IMPORTED_MODULE_2__["default"][thirdResult])) {
          if (fourthResult === resultName) {
            return [
              { mate: firstMate, result: firstResult },
              { mate: secondMate, result: secondResult },
              { mate: thirdMate, result: thirdResult },
              { mate: fourthMate, result: fourthResult }
            ];
          }
        }
      }
    }
  }

  return undefined;
}

(0,_loader__WEBPACK_IMPORTED_MODULE_0__.onPageLoaded)(() => {
  const savedata = localStorage.getItem("pals");
  if (savedata !== null)
    obtainedPals = JSON.parse(savedata);

  console.log(obtainedPals);  
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getSavedPals,
  getPalById,
  findResultFromName,
  getUniqueCombos() { return uniqueCombos; }
});

/***/ }),

/***/ "./src/breedpairs.js":
/*!***************************!*\
  !*** ./src/breedpairs.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "Lamball": {
    "Lamball": "Lamball",
    "Cattiva": "Lamball",
    "Chikipi": "Mau",
    "Lifmunk": "Vixy",
    "Foxparks": "Lifmunk",
    "Fuack": "Foxparks",
    "Sparkit": "Lifmunk",
    "Tanzee": "Jolthog",
    "Rooby": "Ribunny",
    "Pengullet": "Sparkit",
    "Penking": "Verdash",
    "Jolthog": "Hangyu",
    "Jolthog Cryst": "Hangyu",
    "Gumoss": "Pengullet",
    "Gumoss (Special)": "Pengullet",
    "Vixy": "Cattiva",
    "Hoocrates": "Lifmunk",
    "Teafant": "Mau",
    "Depresso": "Lifmunk",
    "Cremis": "Cattiva",
    "Daedream": "Pengullet",
    "Rushoar": "Swee",
    "Nox": "Bristla",
    "Fuddler": "Tocotoco",
    "Killamari": "Depresso",
    "Mau": "Mau",
    "Mau Cryst": "Cremis",
    "Celaray": "Wixen",
    "Direhowl": "Kelpsea",
    "Tocotoco": "Flambelle",
    "Flopie": "Jolthog",
    "Mozzarina": "Woolipop",
    "Bristla": "Foxparks",
    "Gobfin": "Flopie",
    "Gobfin Ignis": "Killamari",
    "Hangyu": "Vixy",
    "Hangyu Cryst": "Vixy",
    "Mossanda": "Loupmoon",
    "Mossanda Lux": "Caprity",
    "Woolipop": "Fuack",
    "Caprity": "Dazzi",
    "Melpaca": "Nox",
    "Eikthyrdeer": "Woolipop",
    "Eikthyrdeer Terra": "Woolipop",
    "Nitewing": "Loupmoon",
    "Ribunny": "Hoocrates",
    "Incineram": "Galeclaw",
    "Incineram Noct": "Galeclaw",
    "Cinnamoth": "Fenglope",
    "Arsox": "Rushoar",
    "Dumud": "Nox",
    "Cawgnito": "Kelpsea Ignis",
    "Leezpunk": "Killamari",
    "Leezpunk Ignis": "Swee",
    "Loupmoon": "Dazzi",
    "Galeclaw": "Tanzee",
    "Robinquill": "Tanzee",
    "Robinquill Terra": "Daedream",
    "Gorirat": "Kelpsea",
    "Beegarde": "Kelpsea Ignis",
    "Elizabee": "Dumud",
    "Grintale": "Verdash",
    "Swee": "Depresso",
    "Sweepa": "Lovander",
    "Chillet": "Rushoar",
    "Univolt": "Cawgnito",
    "Foxcicle": "Lunaris",
    "Pyrin": "Eikthyrdeer",
    "Pyrin Noct": "Digtoise",
    "Reindrix": "Nox",
    "Rayhound": "Lunaris",
    "Kitsun": "Maraith",
    "Dazzi": "Tocotoco",
    "Lunaris": "Killamari",
    "Dinossom": "Maraith",
    "Dinossom Lux": "Rushoar",
    "Surfent": "Robinquill",
    "Surfent Terra": "Felbat",
    "Maraith": "Ribunny",
    "Digtoise": "Wixen",
    "Tombat": "Lunaris",
    "Lovander": "Dazzi",
    "Flambelle": "Lifmunk",
    "Vanwyrm": "Direhowl",
    "Vanwyrm Cryst": "Gorirat",
    "Bushi": "Direhowl",
    "Beakon": "Digtoise",
    "Ragnahawk": "Eikthyrdeer",
    "Katress": "Gobfin",
    "Wixen": "Bristla",
    "Verdash": "Daedream",
    "Vaelet": "Kelpsea",
    "Sibelyx": "Loupmoon",
    "Elphidran": "Felbat",
    "Elphidran Aqua": "Felbat",
    "Kelpsea": "Jolthog",
    "Kelpsea Ignis": "Jolthog",
    "Azurobe": "Fenglope",
    "Cryolinx": "Chillet",
    "Blazehowl": "Gobfin",
    "Blazehowl Noct": "Beegarde",
    "Relaxaurus": "Reindrix",
    "Relaxaurus Lux": "Celaray",
    "Broncherry": "Wixen",
    "Broncherry Aqua": "Rooby",
    "Petallia": "Rushoar",
    "Reptyro": "Dumud",
    "Ice Reptyro": "Digtoise",
    "Kingpaca": "Fenglope",
    "Ice Kingpaca": "Loupmoon",
    "Mammorest": "Melpaca",
    "Mammorest Cryst": "Reindrix",
    "Wumpo": "Loupmoon",
    "Wumpo Botan": "Fenglope",
    "Warsect": "Mozzarina",
    "Fenglope": "Fuddler",
    "Felbat": "Gumoss",
    "Quivern": "Mozzarina",
    "Blazamut": "Rayhound",
    "Helzephyr": "Kitsun",
    "Astegon": "Dinossom",
    "Menasting": "Broncherry",
    "Anubis": "Robinquill",
    "Jormuntide": "Melpaca",
    "Jormuntide Ignis": "Dumud",
    "Suzaku": "Foxcicle",
    "Suzaku Aqua": "Tombat",
    "Grizzbolt": "Kitsun",
    "Lyleen": "Broncherry",
    "Lyleen Noct": "Digtoise",
    "Faleris": "Eikthyrdeer",
    "Orserk": "Chillet",
    "Shadowbeak": "Foxcicle",
    "Paladius": "Petallia",
    "Necromus": "Foxcicle",
    "Frostallion": "Arsox",
    "Frostallion Noct": "Arsox",
    "Jetragon": "Petallia"
  },
  "Cattiva": {
    "Lamball": "Lamball",
    "Cattiva": "Cattiva",
    "Chikipi": "Mau",
    "Lifmunk": "Vixy",
    "Foxparks": "Lifmunk",
    "Fuack": "Foxparks",
    "Sparkit": "Lifmunk",
    "Tanzee": "Pengullet",
    "Rooby": "Ribunny",
    "Pengullet": "Flambelle",
    "Penking": "Verdash",
    "Jolthog": "Hangyu",
    "Jolthog Cryst": "Sparkit",
    "Gumoss": "Pengullet",
    "Gumoss (Special)": "Pengullet",
    "Vixy": "Cremis",
    "Hoocrates": "Lifmunk",
    "Teafant": "Mau",
    "Depresso": "Hangyu",
    "Cremis": "Cattiva",
    "Daedream": "Tocotoco",
    "Rushoar": "Killamari",
    "Nox": "Bristla",
    "Fuddler": "Tocotoco",
    "Killamari": "Jolthog",
    "Mau": "Lamball",
    "Mau Cryst": "Vixy",
    "Celaray": "Wixen",
    "Direhowl": "Kelpsea",
    "Tocotoco": "Foxparks",
    "Flopie": "Jolthog",
    "Mozzarina": "Woolipop",
    "Bristla": "Hoocrates",
    "Gobfin": "Kelpsea Ignis",
    "Gobfin Ignis": "Flopie",
    "Hangyu": "Lifmunk",
    "Hangyu Cryst": "Vixy",
    "Mossanda": "Loupmoon",
    "Mossanda Lux": "Eikthyrdeer",
    "Woolipop": "Bristla",
    "Caprity": "Woolipop",
    "Melpaca": "Nox",
    "Eikthyrdeer": "Woolipop",
    "Eikthyrdeer Terra": "Nox",
    "Nitewing": "Lovander",
    "Ribunny": "Depresso",
    "Incineram": "Galeclaw",
    "Incineram Noct": "Robinquill",
    "Cinnamoth": "Fenglope",
    "Arsox": "Rushoar",
    "Dumud": "Nox",
    "Cawgnito": "Kelpsea Ignis",
    "Leezpunk": "Killamari",
    "Leezpunk Ignis": "Swee",
    "Loupmoon": "Dazzi",
    "Galeclaw": "Tanzee",
    "Robinquill": "Gumoss",
    "Robinquill Terra": "Daedream",
    "Gorirat": "Tanzee",
    "Beegarde": "Kelpsea",
    "Elizabee": "Dumud",
    "Grintale": "Fenglope",
    "Swee": "Depresso",
    "Sweepa": "Caprity",
    "Chillet": "Rushoar",
    "Univolt": "Beegarde",
    "Foxcicle": "Lunaris",
    "Pyrin": "Mozzarina",
    "Pyrin Noct": "Digtoise",
    "Reindrix": "Wixen",
    "Rayhound": "Lunaris",
    "Kitsun": "Maraith",
    "Dazzi": "Tocotoco",
    "Lunaris": "Killamari",
    "Dinossom": "Rushoar",
    "Dinossom Lux": "Rushoar",
    "Surfent": "Felbat",
    "Surfent Terra": "Felbat",
    "Maraith": "Swee",
    "Digtoise": "Rooby",
    "Tombat": "Lunaris",
    "Lovander": "Dazzi",
    "Flambelle": "Lifmunk",
    "Vanwyrm": "Direhowl",
    "Vanwyrm Cryst": "Gorirat",
    "Bushi": "Vaelet",
    "Beakon": "Digtoise",
    "Ragnahawk": "Eikthyrdeer",
    "Katress": "Cawgnito",
    "Wixen": "Ribunny",
    "Verdash": "Fuddler",
    "Vaelet": "Kelpsea",
    "Sibelyx": "Loupmoon",
    "Elphidran": "Felbat",
    "Elphidran Aqua": "Verdash",
    "Kelpsea": "Jolthog",
    "Kelpsea Ignis": "Jolthog",
    "Azurobe": "Fenglope",
    "Cryolinx": "Arsox",
    "Blazehowl": "Gobfin",
    "Blazehowl Noct": "Direhowl",
    "Relaxaurus": "Celaray",
    "Relaxaurus Lux": "Broncherry",
    "Broncherry": "Wixen",
    "Broncherry Aqua": "Maraith",
    "Petallia": "Leezpunk",
    "Reptyro": "Melpaca",
    "Ice Reptyro": "Digtoise",
    "Kingpaca": "Loupmoon",
    "Ice Kingpaca": "Loupmoon",
    "Mammorest": "Reindrix",
    "Mammorest Cryst": "Reindrix",
    "Wumpo": "Loupmoon",
    "Wumpo Botan": "Fenglope",
    "Warsect": "Dumud",
    "Fenglope": "Fuddler",
    "Felbat": "Daedream",
    "Quivern": "Mozzarina",
    "Blazamut": "Rayhound",
    "Helzephyr": "Kitsun",
    "Astegon": "Chillet",
    "Menasting": "Broncherry",
    "Anubis": "Robinquill",
    "Jormuntide": "Melpaca",
    "Jormuntide Ignis": "Melpaca",
    "Suzaku": "Tombat",
    "Suzaku Aqua": "Tombat",
    "Grizzbolt": "Kitsun",
    "Lyleen": "Digtoise",
    "Lyleen Noct": "Kitsun",
    "Faleris": "Eikthyrdeer",
    "Orserk": "Chillet",
    "Shadowbeak": "Foxcicle",
    "Paladius": "Foxcicle",
    "Necromus": "Foxcicle",
    "Frostallion": "Arsox",
    "Frostallion Noct": "Petallia",
    "Jetragon": "Petallia"
  },
  "Chikipi": {
    "Lamball": "Mau",
    "Cattiva": "Mau",
    "Chikipi": "Chikipi",
    "Lifmunk": "Lamball",
    "Foxparks": "Vixy",
    "Fuack": "Hangyu",
    "Sparkit": "Cremis",
    "Tanzee": "Jolthog",
    "Rooby": "Fuack",
    "Pengullet": "Lifmunk",
    "Penking": "Felbat",
    "Jolthog": "Lifmunk",
    "Jolthog Cryst": "Lifmunk",
    "Gumoss": "Jolthog",
    "Gumoss (Special)": "Jolthog",
    "Vixy": "Mau",
    "Hoocrates": "Vixy",
    "Teafant": "Teafant",
    "Depresso": "Lifmunk",
    "Cremis": "Mau",
    "Daedream": "Jolthog",
    "Rushoar": "Bristla",
    "Nox": "Tocotoco",
    "Fuddler": "Jolthog",
    "Killamari": "Foxparks",
    "Mau": "Teafant",
    "Mau Cryst": "Lamball",
    "Celaray": "Woolipop",
    "Direhowl": "Flopie",
    "Tocotoco": "Hangyu",
    "Flopie": "Hoocrates",
    "Mozzarina": "Dazzi",
    "Bristla": "Sparkit",
    "Gobfin": "Killamari",
    "Gobfin Ignis": "Swee",
    "Hangyu": "Cattiva",
    "Hangyu Cryst": "Cattiva",
    "Mossanda": "Loupmoon",
    "Mossanda Lux": "Loupmoon",
    "Woolipop": "Tocotoco",
    "Caprity": "Dazzi",
    "Melpaca": "Woolipop",
    "Eikthyrdeer": "Dazzi",
    "Eikthyrdeer Terra": "Dazzi",
    "Nitewing": "Loupmoon",
    "Ribunny": "Flambelle",
    "Incineram": "Gorirat",
    "Incineram Noct": "Gorirat",
    "Cinnamoth": "Verdash",
    "Arsox": "Maraith",
    "Dumud": "Woolipop",
    "Cawgnito": "Killamari",
    "Leezpunk": "Ribunny",
    "Leezpunk Ignis": "Bristla",
    "Loupmoon": "Fuddler",
    "Galeclaw": "Kelpsea",
    "Robinquill": "Kelpsea",
    "Robinquill Terra": "Tanzee",
    "Gorirat": "Kelpsea Ignis",
    "Beegarde": "Killamari",
    "Elizabee": "Eikthyrdeer",
    "Grintale": "Felbat",
    "Swee": "Foxparks",
    "Sweepa": "Loupmoon",
    "Chillet": "Maraith",
    "Univolt": "Gobfin",
    "Foxcicle": "Rushoar",
    "Pyrin": "Caprity",
    "Pyrin Noct": "Celaray",
    "Reindrix": "Woolipop",
    "Rayhound": "Leezpunk",
    "Kitsun": "Wixen",
    "Dazzi": "Pengullet",
    "Lunaris": "Swee",
    "Dinossom": "Wixen",
    "Dinossom Lux": "Rooby",
    "Surfent": "Galeclaw",
    "Surfent Terra": "Galeclaw",
    "Maraith": "Bristla",
    "Digtoise": "Nox",
    "Tombat": "Rushoar",
    "Lovander": "Fuddler",
    "Flambelle": "Cremis",
    "Vanwyrm": "Cawgnito",
    "Vanwyrm Cryst": "Direhowl",
    "Bushi": "Beegarde",
    "Beakon": "Broncherry",
    "Ragnahawk": "Lovander",
    "Katress": "Lunaris",
    "Wixen": "Fuack",
    "Verdash": "Tanzee",
    "Vaelet": "Kelpsea Ignis",
    "Sibelyx": "Fenglope",
    "Elphidran": "Robinquill",
    "Elphidran Aqua": "Robinquill",
    "Kelpsea": "Depresso",
    "Kelpsea Ignis": "Depresso",
    "Azurobe": "Felbat",
    "Cryolinx": "Dinossom",
    "Blazehowl": "Lunaris",
    "Blazehowl Noct": "Gobfin",
    "Relaxaurus": "Melpaca",
    "Relaxaurus Lux": "Melpaca",
    "Broncherry": "Nox",
    "Broncherry Aqua": "Wixen",
    "Petallia": "Rushoar",
    "Reptyro": "Mozzarina",
    "Ice Reptyro": "Broncherry",
    "Kingpaca": "Fenglope",
    "Ice Kingpaca": "Fenglope",
    "Mammorest": "Dumud",
    "Mammorest Cryst": "Dumud",
    "Wumpo": "Fenglope",
    "Wumpo Botan": "Verdash",
    "Warsect": "Eikthyrdeer",
    "Fenglope": "Gumoss",
    "Felbat": "Kelpsea",
    "Quivern": "Eikthyrdeer",
    "Blazamut": "Tombat",
    "Helzephyr": "Digtoise",
    "Astegon": "Kitsun",
    "Menasting": "Reindrix",
    "Anubis": "Galeclaw",
    "Jormuntide": "Mozzarina",
    "Jormuntide Ignis": "Mozzarina",
    "Suzaku": "Petallia",
    "Suzaku Aqua": "Foxcicle",
    "Grizzbolt": "Digtoise",
    "Lyleen": "Reindrix",
    "Lyleen Noct": "Digtoise",
    "Faleris": "Caprity",
    "Orserk": "Dinossom",
    "Shadowbeak": "Petallia",
    "Paladius": "Arsox",
    "Necromus": "Arsox",
    "Frostallion": "Dinossom",
    "Frostallion Noct": "Chillet",
    "Jetragon": "Arsox"
  },
  "Lifmunk": {
    "Lamball": "Vixy",
    "Cattiva": "Vixy",
    "Chikipi": "Lamball",
    "Lifmunk": "Lifmunk",
    "Foxparks": "Hangyu",
    "Fuack": "Depresso",
    "Sparkit": "Hangyu",
    "Tanzee": "Tocotoco",
    "Rooby": "Killamari",
    "Pengullet": "Hoocrates",
    "Penking": "Fenglope",
    "Jolthog": "Foxparks",
    "Jolthog Cryst": "Foxparks",
    "Gumoss": "Tocotoco",
    "Gumoss (Special)": "Tocotoco",
    "Vixy": "Lifmunk",
    "Hoocrates": "Sparkit",
    "Teafant": "Cattiva",
    "Depresso": "Flambelle",
    "Cremis": "Vixy",
    "Daedream": "Fuack",
    "Rushoar": "Flopie",
    "Nox": "Swee",
    "Fuddler": "Bristla",
    "Killamari": "Jolthog",
    "Mau": "Cremis",
    "Mau Cryst": "Lifmunk",
    "Celaray": "Maraith",
    "Direhowl": "Tanzee",
    "Tocotoco": "Depresso",
    "Flopie": "Pengullet",
    "Mozzarina": "Wixen",
    "Bristla": "Jolthog",
    "Gobfin": "Kelpsea",
    "Gobfin Ignis": "Kelpsea",
    "Hangyu": "Lifmunk",
    "Hangyu Cryst": "Lifmunk",
    "Mossanda": "Caprity",
    "Mossanda Lux": "Mozzarina",
    "Woolipop": "Ribunny",
    "Caprity": "Nox",
    "Melpaca": "Wixen",
    "Eikthyrdeer": "Nox",
    "Eikthyrdeer Terra": "Wixen",
    "Nitewing": "Eikthyrdeer",
    "Ribunny": "Jolthog",
    "Incineram": "Felbat",
    "Incineram Noct": "Felbat",
    "Cinnamoth": "Loupmoon",
    "Arsox": "Lunaris",
    "Dumud": "Wixen",
    "Cawgnito": "Kelpsea",
    "Leezpunk": "Kelpsea Ignis",
    "Leezpunk Ignis": "Killamari",
    "Loupmoon": "Woolipop",
    "Galeclaw": "Daedream",
    "Robinquill": "Fuddler",
    "Robinquill Terra": "Dazzi",
    "Gorirat": "Daedream",
    "Beegarde": "Tanzee",
    "Elizabee": "Reindrix",
    "Grintale": "Fenglope",
    "Swee": "Jolthog",
    "Sweepa": "Eikthyrdeer",
    "Chillet": "Lunaris",
    "Univolt": "Direhowl",
    "Foxcicle": "Gobfin",
    "Pyrin": "Dumud",
    "Pyrin Noct": "Kitsun",
    "Reindrix": "Rooby",
    "Rayhound": "Gobfin",
    "Kitsun": "Rushoar",
    "Dazzi": "Bristla",
    "Lunaris": "Kelpsea Ignis",
    "Dinossom": "Rushoar",
    "Dinossom Lux": "Leezpunk",
    "Surfent": "Verdash",
    "Surfent Terra": "Verdash",
    "Maraith": "Killamari",
    "Digtoise": "Rushoar",
    "Tombat": "Gobfin",
    "Lovander": "Woolipop",
    "Flambelle": "Hangyu",
    "Vanwyrm": "Gorirat",
    "Vanwyrm Cryst": "Galeclaw",
    "Bushi": "Galeclaw",
    "Beakon": "Kitsun",
    "Ragnahawk": "Mozzarina",
    "Katress": "Direhowl",
    "Wixen": "Killamari",
    "Verdash": "Dazzi",
    "Vaelet": "Gumoss",
    "Sibelyx": "Lovander",
    "Elphidran": "Fenglope",
    "Elphidran Aqua": "Fenglope",
    "Kelpsea": "Tocotoco",
    "Kelpsea Ignis": "Pengullet",
    "Azurobe": "Loupmoon",
    "Cryolinx": "Petallia",
    "Blazehowl": "Beegarde",
    "Blazehowl Noct": "Vaelet",
    "Relaxaurus": "Digtoise",
    "Relaxaurus Lux": "Digtoise",
    "Broncherry": "Maraith",
    "Broncherry Aqua": "Rushoar",
    "Petallia": "Lunaris",
    "Reptyro": "Reindrix",
    "Ice Reptyro": "Kitsun",
    "Kingpaca": "Loupmoon",
    "Ice Kingpaca": "Caprity",
    "Mammorest": "Broncherry",
    "Mammorest Cryst": "Broncherry",
    "Wumpo": "Loupmoon",
    "Wumpo Botan": "Loupmoon",
    "Warsect": "Melpaca",
    "Fenglope": "Dazzi",
    "Felbat": "Fuddler",
    "Quivern": "Melpaca",
    "Blazamut": "Blazehowl",
    "Helzephyr": "Dinossom",
    "Astegon": "Arsox",
    "Menasting": "Digtoise",
    "Anubis": "Felbat",
    "Jormuntide": "Celaray",
    "Jormuntide Ignis": "Celaray",
    "Suzaku": "Rayhound",
    "Suzaku Aqua": "Rayhound",
    "Grizzbolt": "Dinossom",
    "Lyleen": "Digtoise",
    "Lyleen Noct": "Dinossom",
    "Faleris": "Dumud",
    "Orserk": "Arsox",
    "Shadowbeak": "Tombat",
    "Paladius": "Tombat",
    "Necromus": "Tombat",
    "Frostallion": "Petallia",
    "Frostallion Noct": "Foxcicle",
    "Jetragon": "Foxcicle"
  },
  "Foxparks": {
    "Lamball": "Lifmunk",
    "Cattiva": "Lifmunk",
    "Chikipi": "Vixy",
    "Lifmunk": "Hangyu",
    "Foxparks": "Foxparks",
    "Fuack": "Jolthog",
    "Sparkit": "Flambelle",
    "Tanzee": "Bristla",
    "Rooby": "Flopie",
    "Pengullet": "Jolthog",
    "Penking": "Loupmoon",
    "Jolthog": "Depresso",
    "Jolthog Cryst": "Depresso",
    "Gumoss": "Bristla",
    "Gumoss (Special)": "Bristla",
    "Vixy": "Lifmunk",
    "Hoocrates": "Foxparks",
    "Teafant": "Vixy",
    "Depresso": "Hoocrates",
    "Cremis": "Lifmunk",
    "Daedream": "Bristla",
    "Rushoar": "Kelpsea",
    "Nox": "Killamari",
    "Fuddler": "Ribunny",
    "Killamari": "Tocotoco",
    "Mau": "Lifmunk",
    "Mau Cryst": "Hangyu",
    "Celaray": "Rushoar",
    "Direhowl": "Daedream",
    "Tocotoco": "Jolthog",
    "Flopie": "Tocotoco",
    "Mozzarina": "Rooby",
    "Bristla": "Jolthog",
    "Gobfin": "Tanzee",
    "Gobfin Ignis": "Tanzee",
    "Hangyu": "Sparkit",
    "Hangyu Cryst": "Sparkit",
    "Mossanda": "Eikthyrdeer",
    "Mossanda Lux": "Dumud",
    "Woolipop": "Killamari",
    "Caprity": "Wixen",
    "Melpaca": "Maraith",
    "Eikthyrdeer": "Wixen",
    "Eikthyrdeer Terra": "Maraith",
    "Nitewing": "Mozzarina",
    "Ribunny": "Pengullet",
    "Incineram": "Verdash",
    "Incineram Noct": "Verdash",
    "Cinnamoth": "Loupmoon",
    "Arsox": "Gobfin",
    "Dumud": "Maraith",
    "Cawgnito": "Gumoss",
    "Leezpunk": "Kelpsea",
    "Leezpunk Ignis": "Kelpsea Ignis",
    "Loupmoon": "Nox",
    "Galeclaw": "Dazzi",
    "Robinquill": "Dazzi",
    "Robinquill Terra": "Dazzi",
    "Gorirat": "Fuddler",
    "Beegarde": "Daedream",
    "Elizabee": "Broncherry",
    "Grintale": "Loupmoon",
    "Swee": "Pengullet",
    "Sweepa": "Mozzarina",
    "Chillet": "Lunaris",
    "Univolt": "Gorirat",
    "Foxcicle": "Cawgnito",
    "Pyrin": "Reindrix",
    "Pyrin Noct": "Dinossom",
    "Reindrix": "Rushoar",
    "Rayhound": "Beegarde",
    "Kitsun": "Lunaris",
    "Dazzi": "Swee",
    "Lunaris": "Kelpsea",
    "Dinossom": "Lunaris",
    "Dinossom Lux": "Lunaris",
    "Surfent": "Fenglope",
    "Surfent Terra": "Fenglope",
    "Maraith": "Kelpsea Ignis",
    "Digtoise": "Rushoar",
    "Tombat": "Cawgnito",
    "Lovander": "Wixen",
    "Flambelle": "Flambelle",
    "Vanwyrm": "Galeclaw",
    "Vanwyrm Cryst": "Felbat",
    "Bushi": "Robinquill",
    "Beakon": "Dinossom",
    "Ragnahawk": "Melpaca",
    "Katress": "Vaelet",
    "Wixen": "Flopie",
    "Verdash": "Woolipop",
    "Vaelet": "Fuddler",
    "Sibelyx": "Eikthyrdeer",
    "Elphidran": "Fenglope",
    "Elphidran Aqua": "Loupmoon",
    "Kelpsea": "Fuack",
    "Kelpsea Ignis": "Tocotoco",
    "Azurobe": "Loupmoon",
    "Cryolinx": "Foxcicle",
    "Blazehowl": "Direhowl",
    "Blazehowl Noct": "Galeclaw",
    "Relaxaurus": "Digtoise",
    "Relaxaurus Lux": "Kitsun",
    "Broncherry": "Rushoar",
    "Broncherry Aqua": "Leezpunk",
    "Petallia": "Gobfin",
    "Reptyro": "Broncherry",
    "Ice Reptyro": "Dinossom",
    "Kingpaca": "Caprity",
    "Ice Kingpaca": "Eikthyrdeer",
    "Mammorest": "Digtoise",
    "Mammorest Cryst": "Digtoise",
    "Wumpo": "Caprity",
    "Wumpo Botan": "Lovander",
    "Warsect": "Celaray",
    "Fenglope": "Woolipop",
    "Felbat": "Dazzi",
    "Quivern": "Reindrix",
    "Blazamut": "Blazehowl",
    "Helzephyr": "Arsox",
    "Astegon": "Petallia",
    "Menasting": "Kitsun",
    "Anubis": "Fenglope",
    "Jormuntide": "Digtoise",
    "Jormuntide Ignis": "Broncherry",
    "Suzaku": "Rayhound",
    "Suzaku Aqua": "Blazehowl",
    "Grizzbolt": "Chillet",
    "Lyleen": "Kitsun",
    "Lyleen Noct": "Chillet",
    "Faleris": "Melpaca",
    "Orserk": "Foxcicle",
    "Shadowbeak": "Rayhound",
    "Paladius": "Rayhound",
    "Necromus": "Rayhound",
    "Frostallion": "Foxcicle",
    "Frostallion Noct": "Tombat",
    "Jetragon": "Tombat"
  },
  "Fuack": {
    "Lamball": "Foxparks",
    "Cattiva": "Foxparks",
    "Chikipi": "Hangyu",
    "Lifmunk": "Depresso",
    "Foxparks": "Jolthog",
    "Fuack": "Fuack",
    "Sparkit": "Jolthog",
    "Tanzee": "Killamari",
    "Rooby": "Gumoss",
    "Pengullet": "Tocotoco",
    "Penking": "Eikthyrdeer",
    "Jolthog": "Pengullet",
    "Jolthog Cryst": "Tocotoco",
    "Gumoss": "Killamari",
    "Gumoss (Special)": "Killamari",
    "Vixy": "Hoocrates",
    "Hoocrates": "Jolthog",
    "Teafant": "Sparkit",
    "Depresso": "Pengullet",
    "Cremis": "Hoocrates",
    "Daedream": "Flopie",
    "Rushoar": "Daedream",
    "Nox": "Kelpsea",
    "Fuddler": "Kelpsea Ignis",
    "Killamari": "Ribunny",
    "Mau": "Flambelle",
    "Mau Cryst": "Depresso",
    "Celaray": "Lunaris",
    "Direhowl": "Woolipop",
    "Tocotoco": "Tocotoco",
    "Flopie": "Swee",
    "Mozzarina": "Leezpunk",
    "Bristla": "Bristla",
    "Gobfin": "Dazzi",
    "Gobfin Ignis": "Dazzi",
    "Hangyu": "Jolthog",
    "Hangyu Cryst": "Depresso",
    "Mossanda": "Reindrix",
    "Mossanda Lux": "Broncherry",
    "Woolipop": "Kelpsea",
    "Caprity": "Rushoar",
    "Melpaca": "Lunaris",
    "Eikthyrdeer": "Rushoar",
    "Eikthyrdeer Terra": "Lunaris",
    "Nitewing": "Reindrix",
    "Ribunny": "Bristla",
    "Incineram": "Loupmoon",
    "Incineram Noct": "Loupmoon",
    "Cinnamoth": "Mozzarina",
    "Arsox": "Direhowl",
    "Dumud": "Lunaris",
    "Cawgnito": "Dazzi",
    "Leezpunk": "Fuddler",
    "Leezpunk Ignis": "Daedream",
    "Loupmoon": "Rushoar",
    "Galeclaw": "Nox",
    "Robinquill": "Nox",
    "Robinquill Terra": "Wixen",
    "Gorirat": "Woolipop",
    "Beegarde": "Dazzi",
    "Elizabee": "Kitsun",
    "Grintale": "Eikthyrdeer",
    "Swee": "Bristla",
    "Sweepa": "Celaray",
    "Chillet": "Direhowl",
    "Univolt": "Felbat",
    "Foxcicle": "Gorirat",
    "Pyrin": "Digtoise",
    "Pyrin Noct": "Arsox",
    "Reindrix": "Lunaris",
    "Rayhound": "Galeclaw",
    "Kitsun": "Cawgnito",
    "Dazzi": "Kelpsea Ignis",
    "Lunaris": "Fuddler",
    "Dinossom": "Cawgnito",
    "Dinossom Lux": "Beegarde",
    "Surfent": "Loupmoon",
    "Surfent Terra": "Lovander",
    "Maraith": "Gumoss",
    "Digtoise": "Gobfin",
    "Tombat": "Gorirat",
    "Lovander": "Rushoar",
    "Flambelle": "Jolthog",
    "Vanwyrm": "Verdash",
    "Vanwyrm Cryst": "Fenglope",
    "Bushi": "Fenglope",
    "Beakon": "Petallia",
    "Ragnahawk": "Digtoise",
    "Katress": "Robinquill",
    "Wixen": "Tanzee",
    "Verdash": "Wixen",
    "Vaelet": "Woolipop",
    "Sibelyx": "Melpaca",
    "Elphidran": "Caprity",
    "Elphidran Aqua": "Caprity",
    "Kelpsea": "Killamari",
    "Kelpsea Ignis": "Swee",
    "Azurobe": "Eikthyrdeer",
    "Cryolinx": "Rayhound",
    "Blazehowl": "Robinquill",
    "Blazehowl Noct": "Felbat",
    "Relaxaurus": "Chillet",
    "Relaxaurus Lux": "Chillet",
    "Broncherry": "Broncherry Aqua",
    "Broncherry Aqua": "Gobfin",
    "Petallia": "Direhowl",
    "Reptyro": "Kitsun",
    "Ice Reptyro": "Petallia",
    "Kingpaca": "Dumud",
    "Ice Kingpaca": "Melpaca",
    "Mammorest": "Dinossom",
    "Mammorest Cryst": "Dinossom",
    "Wumpo": "Dumud",
    "Wumpo Botan": "Mozzarina",
    "Warsect": "Kitsun",
    "Fenglope": "Rooby",
    "Felbat": "Wixen",
    "Quivern": "Digtoise",
    "Blazamut": "Univolt",
    "Helzephyr": "Foxcicle",
    "Astegon": "Rayhound",
    "Menasting": "Arsox",
    "Anubis": "Loupmoon",
    "Jormuntide": "Dinossom",
    "Jormuntide Ignis": "Dinossom",
    "Suzaku": "Univolt",
    "Suzaku Aqua": "Univolt",
    "Grizzbolt": "Foxcicle",
    "Lyleen": "Arsox",
    "Lyleen Noct": "Foxcicle",
    "Faleris": "Digtoise",
    "Orserk": "Rayhound",
    "Shadowbeak": "Katress",
    "Paladius": "Blazehowl",
    "Necromus": "Katress",
    "Frostallion": "Rayhound",
    "Frostallion Noct": "Blazehowl",
    "Jetragon": "Blazehowl"
  },
  "Sparkit": {
    "Lamball": "Lifmunk",
    "Cattiva": "Lifmunk",
    "Chikipi": "Cremis",
    "Lifmunk": "Hangyu",
    "Foxparks": "Flambelle",
    "Fuack": "Jolthog",
    "Sparkit": "Sparkit",
    "Tanzee": "Fuack",
    "Rooby": "Flopie",
    "Pengullet": "Depresso",
    "Penking": "Loupmoon",
    "Jolthog": "Hoocrates",
    "Jolthog Cryst": "Depresso",
    "Gumoss": "Bristla",
    "Gumoss (Special)": "Bristla",
    "Vixy": "Lifmunk",
    "Hoocrates": "Foxparks",
    "Teafant": "Vixy",
    "Depresso": "Foxparks",
    "Cremis": "Lifmunk",
    "Daedream": "Bristla",
    "Rushoar": "Kelpsea Ignis",
    "Nox": "Killamari",
    "Fuddler": "Bristla",
    "Killamari": "Pengullet",
    "Mau": "Vixy",
    "Mau Cryst": "Lifmunk",
    "Celaray": "Rushoar",
    "Direhowl": "Daedream",
    "Tocotoco": "Jolthog",
    "Flopie": "Tocotoco",
    "Mozzarina": "Wixen",
    "Bristla": "Jolthog",
    "Gobfin": "Tanzee",
    "Gobfin Ignis": "Kelpsea",
    "Hangyu": "Hangyu",
    "Hangyu Cryst": "Hangyu",
    "Mossanda": "Eikthyrdeer",
    "Mossanda Lux": "Dumud",
    "Woolipop": "Swee",
    "Caprity": "Wixen",
    "Melpaca": "Maraith",
    "Eikthyrdeer": "Wixen",
    "Eikthyrdeer Terra": "Rooby",
    "Nitewing": "Eikthyrdeer",
    "Ribunny": "Jolthog",
    "Incineram": "Felbat",
    "Incineram Noct": "Verdash",
    "Cinnamoth": "Loupmoon",
    "Arsox": "Lunaris",
    "Dumud": "Rooby",
    "Cawgnito": "Tanzee",
    "Leezpunk": "Kelpsea",
    "Leezpunk Ignis": "Kelpsea Ignis",
    "Loupmoon": "Nox",
    "Galeclaw": "Fuddler",
    "Robinquill": "Dazzi",
    "Robinquill Terra": "Dazzi",
    "Gorirat": "Fuddler",
    "Beegarde": "Gumoss",
    "Elizabee": "Celaray",
    "Grintale": "Loupmoon",
    "Swee": "Pengullet",
    "Sweepa": "Mozzarina",
    "Chillet": "Lunaris",
    "Univolt": "Gorirat",
    "Foxcicle": "Gobfin",
    "Pyrin": "Melpaca",
    "Pyrin Noct": "Kitsun",
    "Reindrix": "Maraith",
    "Rayhound": "Cawgnito",
    "Kitsun": "Leezpunk",
    "Dazzi": "Ribunny",
    "Lunaris": "Kelpsea",
    "Dinossom": "Lunaris",
    "Dinossom Lux": "Lunaris",
    "Surfent": "Fenglope",
    "Surfent Terra": "Fenglope",
    "Maraith": "Flopie",
    "Digtoise": "Rushoar",
    "Tombat": "Cawgnito",
    "Lovander": "Nox",
    "Flambelle": "Sparkit",
    "Vanwyrm": "Galeclaw",
    "Vanwyrm Cryst": "Robinquill",
    "Bushi": "Galeclaw",
    "Beakon": "Dinossom",
    "Ragnahawk": "Dumud",
    "Katress": "Direhowl",
    "Wixen": "Killamari",
    "Verdash": "Dazzi",
    "Vaelet": "Daedream",
    "Sibelyx": "Caprity",
    "Elphidran": "Fenglope",
    "Elphidran Aqua": "Fenglope",
    "Kelpsea": "Tocotoco",
    "Kelpsea Ignis": "Tocotoco",
    "Azurobe": "Loupmoon",
    "Cryolinx": "Foxcicle",
    "Blazehowl": "Direhowl",
    "Blazehowl Noct": "Gorirat",
    "Relaxaurus": "Relaxaurus Lux",
    "Relaxaurus Lux": "Digtoise",
    "Broncherry": "Rushoar",
    "Broncherry Aqua": "Rushoar",
    "Petallia": "Gobfin",
    "Reptyro": "Broncherry",
    "Ice Reptyro": "Dinossom",
    "Kingpaca": "Lovander",
    "Ice Kingpaca": "Eikthyrdeer",
    "Mammorest": "Digtoise",
    "Mammorest Cryst": "Digtoise",
    "Wumpo": "Caprity",
    "Wumpo Botan": "Loupmoon",
    "Warsect": "Reindrix",
    "Fenglope": "Woolipop",
    "Felbat": "Dazzi",
    "Quivern": "Reindrix",
    "Blazamut": "Blazehowl",
    "Helzephyr": "Chillet",
    "Astegon": "Petallia",
    "Menasting": "Kitsun",
    "Anubis": "Verdash",
    "Jormuntide": "Broncherry",
    "Jormuntide Ignis": "Broncherry",
    "Suzaku": "Rayhound",
    "Suzaku Aqua": "Blazehowl",
    "Grizzbolt": "Chillet",
    "Lyleen": "Kitsun",
    "Lyleen Noct": "Dinossom",
    "Faleris": "Melpaca",
    "Orserk": "Petallia",
    "Shadowbeak": "Rayhound",
    "Paladius": "Tombat",
    "Necromus": "Rayhound",
    "Frostallion": "Foxcicle",
    "Frostallion Noct": "Tombat",
    "Jetragon": "Tombat"
  },
  "Tanzee": {
    "Lamball": "Jolthog",
    "Cattiva": "Pengullet",
    "Chikipi": "Jolthog",
    "Lifmunk": "Tocotoco",
    "Foxparks": "Bristla",
    "Fuack": "Killamari",
    "Sparkit": "Fuack",
    "Tanzee": "Tanzee",
    "Rooby": "Dazzi",
    "Pengullet": "Swee",
    "Penking": "Melpaca",
    "Jolthog": "Ribunny",
    "Jolthog Cryst": "Swee",
    "Gumoss": "Tanzee",
    "Gumoss (Special)": "Tanzee",
    "Vixy": "Pengullet",
    "Hoocrates": "Bristla",
    "Teafant": "Jolthog",
    "Depresso": "Bristla",
    "Cremis": "Pengullet",
    "Daedream": "Gumoss",
    "Rushoar": "Woolipop",
    "Nox": "Dazzi",
    "Fuddler": "Daedream",
    "Killamari": "Kelpsea Ignis",
    "Mau": "Jolthog",
    "Mau Cryst": "Tocotoco",
    "Celaray": "Direhowl",
    "Direhowl": "Rooby",
    "Tocotoco": "Killamari",
    "Flopie": "Kelpsea",
    "Mozzarina": "Cawgnito",
    "Bristla": "Killamari",
    "Gobfin": "Wixen",
    "Gobfin Ignis": "Nox",
    "Hangyu": "Tocotoco",
    "Hangyu Cryst": "Tocotoco",
    "Mossanda": "Digtoise",
    "Mossanda Lux": "Dinossom",
    "Woolipop": "Fuddler",
    "Caprity": "Gobfin",
    "Melpaca": "Beegarde",
    "Eikthyrdeer": "Gobfin",
    "Eikthyrdeer Terra": "Cawgnito",
    "Nitewing": "Kitsun",
    "Ribunny": "Flopie",
    "Incineram": "Eikthyrdeer",
    "Incineram Noct": "Eikthyrdeer",
    "Cinnamoth": "Celaray",
    "Arsox": "Robinquill",
    "Dumud": "Beegarde",
    "Cawgnito": "Wixen",
    "Leezpunk": "Woolipop",
    "Leezpunk Ignis": "Woolipop",
    "Loupmoon": "Lunaris",
    "Galeclaw": "Rushoar",
    "Robinquill": "Rushoar",
    "Robinquill Terra": "Rushoar",
    "Gorirat": "Maraith",
    "Beegarde": "Wixen",
    "Elizabee": "Arsox",
    "Grintale": "Reindrix",
    "Swee": "Kelpsea Ignis",
    "Sweepa": "Kitsun",
    "Chillet": "Galeclaw",
    "Univolt": "Loupmoon",
    "Foxcicle": "Felbat",
    "Pyrin": "Chillet",
    "Pyrin Noct": "Tombat",
    "Reindrix": "Direhowl",
    "Rayhound": "Verdash",
    "Kitsun": "Gorirat",
    "Dazzi": "Daedream",
    "Lunaris": "Nox",
    "Dinossom": "Galeclaw",
    "Dinossom Lux": "Galeclaw",
    "Surfent": "Mozzarina",
    "Surfent Terra": "Dumud",
    "Maraith": "Dazzi",
    "Digtoise": "Vaelet",
    "Tombat": "Felbat",
    "Lovander": "Gobfin",
    "Flambelle": "Fuack",
    "Vanwyrm": "Loupmoon",
    "Vanwyrm Cryst": "Caprity",
    "Bushi": "Loupmoon",
    "Beakon": "Rayhound",
    "Ragnahawk": "Dinossom",
    "Katress": "Fenglope",
    "Wixen": "Dazzi",
    "Verdash": "Leezpunk",
    "Vaelet": "Maraith",
    "Sibelyx": "Digtoise",
    "Elphidran": "Dumud",
    "Elphidran Aqua": "Melpaca",
    "Kelpsea": "Kelpsea",
    "Kelpsea Ignis": "Kelpsea",
    "Azurobe": "Reindrix",
    "Cryolinx": "Univolt",
    "Blazehowl": "Fenglope",
    "Blazehowl Noct": "Loupmoon",
    "Relaxaurus": "Foxcicle",
    "Relaxaurus Lux": "Foxcicle",
    "Broncherry": "Direhowl",
    "Broncherry Aqua": "Gorirat",
    "Petallia": "Robinquill",
    "Reptyro": "Arsox",
    "Ice Reptyro": "Rayhound",
    "Kingpaca": "Broncherry",
    "Ice Kingpaca": "Digtoise",
    "Mammorest": "Petallia",
    "Mammorest Cryst": "Foxcicle",
    "Wumpo": "Digtoise",
    "Wumpo Botan": "Broncherry",
    "Warsect": "Arsox",
    "Fenglope": "Lunaris",
    "Felbat": "Rushoar",
    "Quivern": "Chillet",
    "Blazamut": "Bushi",
    "Helzephyr": "Blazehowl",
    "Astegon": "Katress",
    "Menasting": "Tombat",
    "Anubis": "Mozzarina",
    "Jormuntide": "Petallia",
    "Jormuntide Ignis": "Petallia",
    "Suzaku": "Vanwyrm",
    "Suzaku Aqua": "Bushi",
    "Grizzbolt": "Rayhound",
    "Lyleen": "Tombat",
    "Lyleen Noct": "Rayhound",
    "Faleris": "Dinossom",
    "Orserk": "Katress",
    "Shadowbeak": "Vanwyrm",
    "Paladius": "Vanwyrm",
    "Necromus": "Vanwyrm",
    "Frostallion": "Univolt",
    "Frostallion Noct": "Univolt",
    "Jetragon": "Univolt"
  },
  "Rooby": {
    "Lamball": "Ribunny",
    "Cattiva": "Ribunny",
    "Chikipi": "Fuack",
    "Lifmunk": "Killamari",
    "Foxparks": "Flopie",
    "Fuack": "Gumoss",
    "Sparkit": "Flopie",
    "Tanzee": "Dazzi",
    "Rooby": "Rooby",
    "Pengullet": "Tanzee",
    "Penking": "Kitsun",
    "Jolthog": "Kelpsea",
    "Jolthog Cryst": "Kelpsea",
    "Gumoss": "Woolipop",
    "Gumoss (Special)": "Woolipop",
    "Vixy": "Swee",
    "Hoocrates": "Kelpsea Ignis",
    "Teafant": "Bristla",
    "Depresso": "Kelpsea Ignis",
    "Cremis": "Swee",
    "Daedream": "Woolipop",
    "Rushoar": "Maraith",
    "Nox": "Wixen",
    "Fuddler": "Woolipop",
    "Killamari": "Fuddler",
    "Mau": "Bristla",
    "Mau Cryst": "Swee",
    "Celaray": "Felbat",
    "Direhowl": "Lunaris",
    "Tocotoco": "Tanzee",
    "Flopie": "Fuddler",
    "Mozzarina": "Galeclaw",
    "Bristla": "Gumoss",
    "Gobfin": "Gobfin Ignis",
    "Gobfin Ignis": "Rushoar",
    "Hangyu": "Killamari",
    "Hangyu Cryst": "Killamari",
    "Mossanda": "Arsox",
    "Mossanda Lux": "Petallia",
    "Woolipop": "Nox",
    "Caprity": "Gorirat",
    "Melpaca": "Robinquill",
    "Eikthyrdeer": "Gorirat",
    "Eikthyrdeer Terra": "Galeclaw",
    "Nitewing": "Arsox",
    "Ribunny": "Daedream",
    "Incineram": "Celaray",
    "Incineram Noct": "Celaray",
    "Cinnamoth": "Dinossom",
    "Arsox": "Fenglope",
    "Dumud": "Galeclaw",
    "Cawgnito": "Leezpunk",
    "Leezpunk": "Rushoar",
    "Leezpunk Ignis": "Maraith",
    "Loupmoon": "Vaelet",
    "Galeclaw": "Gobfin",
    "Robinquill": "Gobfin",
    "Robinquill Terra": "Cawgnito",
    "Gorirat": "Gobfin",
    "Beegarde": "Lunaris",
    "Elizabee": "Rayhound",
    "Grintale": "Kitsun",
    "Swee": "Daedream",
    "Sweepa": "Petallia",
    "Chillet": "Fenglope",
    "Univolt": "Eikthyrdeer",
    "Foxcicle": "Loupmoon",
    "Pyrin": "Foxcicle",
    "Pyrin Noct": "Katress",
    "Reindrix": "Robinquill",
    "Rayhound": "Loupmoon",
    "Kitsun": "Verdash",
    "Dazzi": "Nox",
    "Lunaris": "Rushoar",
    "Dinossom": "Verdash",
    "Dinossom Lux": "Fenglope",
    "Surfent": "Broncherry",
    "Surfent Terra": "Digtoise",
    "Maraith": "Rooby",
    "Digtoise": "Felbat",
    "Tombat": "Loupmoon",
    "Lovander": "Vaelet",
    "Flambelle": "Flopie",
    "Vanwyrm": "Mozzarina",
    "Vanwyrm Cryst": "Melpaca",
    "Bushi": "Dumud",
    "Beakon": "Univolt",
    "Ragnahawk": "Foxcicle",
    "Katress": "Caprity",
    "Wixen": "Wixen",
    "Verdash": "Beegarde",
    "Vaelet": "Lunaris",
    "Sibelyx": "Chillet",
    "Elphidran": "Digtoise",
    "Elphidran Aqua": "Digtoise",
    "Kelpsea": "Dazzi",
    "Kelpsea Ignis": "Dazzi",
    "Azurobe": "Kitsun",
    "Cryolinx": "Bushi",
    "Blazehowl": "Caprity",
    "Blazehowl Noct": "Mozzarina",
    "Relaxaurus": "Blazehowl",
    "Relaxaurus Lux": "Blazehowl",
    "Broncherry": "Felbat",
    "Broncherry Aqua": "Verdash",
    "Petallia": "Fenglope",
    "Reptyro": "Rayhound",
    "Ice Reptyro": "Katress",
    "Kingpaca": "Dinossom",
    "Ice Kingpaca": "Chillet",
    "Mammorest": "Rayhound",
    "Mammorest Cryst": "Blazehowl",
    "Wumpo": "Chillet",
    "Wumpo Botan": "Dinossom",
    "Warsect": "Tombat",
    "Fenglope": "Beegarde",
    "Felbat": "Cawgnito",
    "Quivern": "Tombat",
    "Blazamut": "Incineram",
    "Helzephyr": "Univolt",
    "Astegon": "Vanwyrm",
    "Menasting": "Blazehowl",
    "Anubis": "Broncherry",
    "Jormuntide": "Rayhound",
    "Jormuntide Ignis": "Rayhound",
    "Suzaku": "Incineram",
    "Suzaku Aqua": "Incineram",
    "Grizzbolt": "Univolt",
    "Lyleen": "Katress",
    "Lyleen Noct": "Univolt",
    "Faleris": "Foxcicle",
    "Orserk": "Bushi",
    "Shadowbeak": "Incineram",
    "Paladius": "Bushi",
    "Necromus": "Incineram",
    "Frostallion": "Bushi",
    "Frostallion Noct": "Bushi",
    "Jetragon": "Bushi"
  },
  "Pengullet": {
    "Lamball": "Sparkit",
    "Cattiva": "Flambelle",
    "Chikipi": "Lifmunk",
    "Lifmunk": "Hoocrates",
    "Foxparks": "Jolthog",
    "Fuack": "Tocotoco",
    "Sparkit": "Depresso",
    "Tanzee": "Swee",
    "Rooby": "Tanzee",
    "Pengullet": "Pengullet",
    "Penking": "Caprity",
    "Jolthog": "Jolthog Cryst",
    "Jolthog Cryst": "Pengullet",
    "Gumoss": "Killamari",
    "Gumoss (Special)": "Killamari",
    "Vixy": "Foxparks",
    "Hoocrates": "Jolthog",
    "Teafant": "Hangyu",
    "Depresso": "Jolthog",
    "Cremis": "Flambelle",
    "Daedream": "Killamari",
    "Rushoar": "Gumoss",
    "Nox": "Kelpsea",
    "Fuddler": "Killamari",
    "Killamari": "Bristla",
    "Mau": "Mau Cryst",
    "Mau Cryst": "Foxparks",
    "Celaray": "Lunaris",
    "Direhowl": "Dazzi",
    "Tocotoco": "Tocotoco",
    "Flopie": "Bristla",
    "Mozzarina": "Rushoar",
    "Bristla": "Tocotoco",
    "Gobfin": "Fuddler",
    "Gobfin Ignis": "Fuddler",
    "Hangyu": "Depresso",
    "Hangyu Cryst": "Hoocrates",
    "Mossanda": "Melpaca",
    "Mossanda Lux": "Celaray",
    "Woolipop": "Kelpsea Ignis",
    "Caprity": "Rushoar",
    "Melpaca": "Leezpunk",
    "Eikthyrdeer": "Rushoar",
    "Eikthyrdeer Terra": "Rushoar",
    "Nitewing": "Melpaca",
    "Ribunny": "Fuack",
    "Incineram": "Fenglope",
    "Incineram Noct": "Loupmoon",
    "Cinnamoth": "Eikthyrdeer",
    "Arsox": "Beegarde",
    "Dumud": "Leezpunk",
    "Cawgnito": "Dazzi",
    "Leezpunk": "Daedream",
    "Leezpunk Ignis": "Tanzee",
    "Loupmoon": "Maraith",
    "Galeclaw": "Woolipop",
    "Robinquill": "Woolipop",
    "Robinquill Terra": "Nox",
    "Gorirat": "Woolipop",
    "Beegarde": "Dazzi",
    "Elizabee": "Digtoise",
    "Grintale": "Caprity",
    "Swee": "Bristla",
    "Sweepa": "Reindrix",
    "Chillet": "Cawgnito",
    "Univolt": "Robinquill",
    "Foxcicle": "Direhowl",
    "Pyrin": "Digtoise",
    "Pyrin Noct": "Arsox",
    "Reindrix": "Lunaris",
    "Rayhound": "Gorirat",
    "Kitsun": "Gobfin",
    "Dazzi": "Flopie",
    "Lunaris": "Daedream",
    "Dinossom": "Gobfin",
    "Dinossom Lux": "Cawgnito",
    "Surfent": "Loupmoon",
    "Surfent Terra": "Loupmoon",
    "Maraith": "Tanzee",
    "Digtoise": "Lunaris",
    "Tombat": "Vaelet",
    "Lovander": "Maraith",
    "Flambelle": "Depresso",
    "Vanwyrm": "Felbat",
    "Vanwyrm Cryst": "Fenglope",
    "Bushi": "Verdash",
    "Beakon": "Arsox",
    "Ragnahawk": "Broncherry",
    "Katress": "Galeclaw",
    "Wixen": "Kelpsea",
    "Verdash": "Wixen",
    "Vaelet": "Dazzi",
    "Sibelyx": "Dumud",
    "Elphidran": "Loupmoon",
    "Elphidran Aqua": "Lovander",
    "Kelpsea": "Swee",
    "Kelpsea Ignis": "Ribunny",
    "Azurobe": "Eikthyrdeer",
    "Cryolinx": "Rayhound",
    "Blazehowl": "Galeclaw",
    "Blazehowl Noct": "Felbat",
    "Relaxaurus": "Dinossom",
    "Relaxaurus Lux": "Dinossom",
    "Broncherry": "Lunaris",
    "Broncherry Aqua": "Gobfin",
    "Petallia": "Direhowl",
    "Reptyro": "Kitsun",
    "Ice Reptyro": "Arsox",
    "Kingpaca": "Mozzarina",
    "Ice Kingpaca": "Dumud",
    "Mammorest": "Kitsun",
    "Mammorest Cryst": "Dinossom",
    "Wumpo": "Mozzarina",
    "Wumpo Botan": "Eikthyrdeer",
    "Warsect": "Digtoise",
    "Fenglope": "Wixen",
    "Felbat": "Nox",
    "Quivern": "Digtoise",
    "Blazamut": "Univolt",
    "Helzephyr": "Foxcicle",
    "Astegon": "Tombat",
    "Menasting": "Chillet",
    "Anubis": "Loupmoon",
    "Jormuntide": "Kitsun",
    "Jormuntide Ignis": "Kitsun",
    "Suzaku": "Katress",
    "Suzaku Aqua": "Univolt",
    "Grizzbolt": "Petallia",
    "Lyleen": "Chillet",
    "Lyleen Noct": "Petallia",
    "Faleris": "Broncherry",
    "Orserk": "Tombat",
    "Shadowbeak": "Blazehowl",
    "Paladius": "Blazehowl",
    "Necromus": "Blazehowl",
    "Frostallion": "Rayhound",
    "Frostallion Noct": "Rayhound",
    "Jetragon": "Blazehowl"
  },
  "Penking": {
    "Lamball": "Verdash",
    "Cattiva": "Verdash",
    "Chikipi": "Felbat",
    "Lifmunk": "Fenglope",
    "Foxparks": "Loupmoon",
    "Fuack": "Eikthyrdeer",
    "Sparkit": "Loupmoon",
    "Tanzee": "Melpaca",
    "Rooby": "Kitsun",
    "Pengullet": "Caprity",
    "Penking": "Penking",
    "Jolthog": "Loupmoon",
    "Jolthog Cryst": "Lovander",
    "Gumoss": "Reindrix",
    "Gumoss (Special)": "Reindrix",
    "Vixy": "Fenglope",
    "Hoocrates": "Loupmoon",
    "Teafant": "Felbat",
    "Depresso": "Loupmoon",
    "Cremis": "Verdash",
    "Daedream": "Reindrix",
    "Rushoar": "Kitsun",
    "Nox": "Digtoise",
    "Fuddler": "Celaray",
    "Killamari": "Mozzarina",
    "Mau": "Felbat",
    "Mau Cryst": "Fenglope",
    "Celaray": "Katress",
    "Direhowl": "Arsox",
    "Tocotoco": "Caprity",
    "Flopie": "Dumud",
    "Mozzarina": "Blazehowl",
    "Bristla": "Eikthyrdeer",
    "Gobfin": "Chillet",
    "Gobfin Ignis": "Dinossom",
    "Hangyu": "Fenglope",
    "Hangyu Cryst": "Fenglope",
    "Mossanda": "Wumpo Botan",
    "Mossanda Lux": "Sibelyx",
    "Woolipop": "Digtoise",
    "Caprity": "Rayhound",
    "Melpaca": "Blazehowl",
    "Eikthyrdeer": "Blazehowl",
    "Eikthyrdeer Terra": "Blazehowl",
    "Nitewing": "Kingpaca",
    "Ribunny": "Eikthyrdeer",
    "Incineram": "Surfent",
    "Incineram Noct": "Elphidran",
    "Cinnamoth": "Azurobe",
    "Arsox": "Vanwyrm",
    "Dumud": "Blazehowl",
    "Cawgnito": "Chillet",
    "Leezpunk": "Dinossom",
    "Leezpunk Ignis": "Kitsun",
    "Loupmoon": "Rayhound",
    "Galeclaw": "Petallia",
    "Robinquill": "Foxcicle",
    "Robinquill Terra": "Foxcicle",
    "Gorirat": "Petallia",
    "Beegarde": "Arsox",
    "Elizabee": "Nitewing",
    "Grintale": "Penking",
    "Swee": "Mozzarina",
    "Sweepa": "Wumpo",
    "Chillet": "Vanwyrm",
    "Univolt": "Incineram",
    "Foxcicle": "Bushi",
    "Pyrin": "Sibelyx",
    "Pyrin Noct": "Ragnahawk",
    "Reindrix": "Katress",
    "Rayhound": "Bushi",
    "Kitsun": "Univolt",
    "Dazzi": "Broncherry",
    "Lunaris": "Dinossom",
    "Dinossom": "Univolt",
    "Dinossom Lux": "Vanwyrm",
    "Surfent": "Elphidran",
    "Surfent Terra": "Elphidran",
    "Maraith": "Kitsun",
    "Digtoise": "Univolt",
    "Tombat": "Bushi",
    "Lovander": "Rayhound",
    "Flambelle": "Loupmoon",
    "Vanwyrm": "Incineram",
    "Vanwyrm Cryst": "Anubis",
    "Bushi": "Anubis",
    "Beakon": "Pyrin",
    "Ragnahawk": "Sibelyx",
    "Katress": "Incineram",
    "Wixen": "Digtoise",
    "Verdash": "Tombat",
    "Vaelet": "Arsox",
    "Sibelyx": "Wumpo Botan",
    "Elphidran": "Elphidran",
    "Elphidran Aqua": "Penking",
    "Kelpsea": "Melpaca",
    "Kelpsea Ignis": "Dumud",
    "Azurobe": "Grintale",
    "Cryolinx": "Reptyro",
    "Blazehowl": "Incineram",
    "Blazehowl Noct": "Incineram",
    "Relaxaurus": "Sweepa",
    "Relaxaurus Lux": "Sweepa",
    "Broncherry": "Univolt",
    "Broncherry Aqua": "Univolt",
    "Petallia": "Vanwyrm",
    "Reptyro": "Nitewing",
    "Ice Reptyro": "Ragnahawk",
    "Kingpaca": "Azurobe",
    "Ice Kingpaca": "Wumpo Botan",
    "Mammorest": "Sweepa",
    "Mammorest Cryst": "Sweepa",
    "Wumpo": "Cinnamoth",
    "Wumpo Botan": "Azurobe",
    "Warsect": "Mossanda",
    "Fenglope": "Tombat",
    "Felbat": "Foxcicle",
    "Quivern": "Mossanda",
    "Blazamut": "Menasting",
    "Helzephyr": "Pyrin",
    "Astegon": "Elizabee",
    "Menasting": "Ragnahawk",
    "Anubis": "Elphidran",
    "Jormuntide": "Nitewing",
    "Jormuntide Ignis": "Nitewing",
    "Suzaku": "Relaxaurus",
    "Suzaku Aqua": "Relaxaurus",
    "Grizzbolt": "Pyrin",
    "Lyleen": "Ragnahawk",
    "Lyleen Noct": "Pyrin",
    "Faleris": "Sibelyx",
    "Orserk": "Elizabee",
    "Shadowbeak": "Relaxaurus",
    "Paladius": "Mammorest",
    "Necromus": "Mammorest",
    "Frostallion": "Reptyro",
    "Frostallion Noct": "Jormuntide",
    "Jetragon": "Jormuntide"
  },
  "Jolthog": {
    "Lamball": "Hangyu",
    "Cattiva": "Hangyu",
    "Chikipi": "Lifmunk",
    "Lifmunk": "Foxparks",
    "Foxparks": "Depresso",
    "Fuack": "Pengullet",
    "Sparkit": "Hoocrates",
    "Tanzee": "Ribunny",
    "Rooby": "Kelpsea",
    "Pengullet": "Jolthog Cryst",
    "Penking": "Loupmoon",
    "Jolthog": "Jolthog",
    "Jolthog Cryst": "Jolthog",
    "Gumoss": "Swee",
    "Gumoss (Special)": "Swee",
    "Vixy": "Sparkit",
    "Hoocrates": "Depresso",
    "Teafant": "Lifmunk",
    "Depresso": "Jolthog",
    "Cremis": "Sparkit",
    "Daedream": "Swee",
    "Rushoar": "Tanzee",
    "Nox": "Kelpsea Ignis",
    "Fuddler": "Killamari",
    "Killamari": "Fuack",
    "Mau": "Lifmunk",
    "Mau Cryst": "Flambelle",
    "Celaray": "Leezpunk",
    "Direhowl": "Dazzi",
    "Tocotoco": "Pengullet",
    "Flopie": "Bristla",
    "Mozzarina": "Rushoar",
    "Bristla": "Tocotoco",
    "Gobfin": "Daedream",
    "Gobfin Ignis": "Daedream",
    "Hangyu": "Foxparks",
    "Hangyu Cryst": "Foxparks",
    "Mossanda": "Dumud",
    "Mossanda Lux": "Reindrix",
    "Woolipop": "Flopie",
    "Caprity": "Maraith",
    "Melpaca": "Rushoar",
    "Eikthyrdeer": "Maraith",
    "Eikthyrdeer Terra": "Rushoar",
    "Nitewing": "Dumud",
    "Ribunny": "Tocotoco",
    "Incineram": "Fenglope",
    "Incineram Noct": "Fenglope",
    "Cinnamoth": "Caprity",
    "Arsox": "Cawgnito",
    "Dumud": "Rushoar",
    "Cawgnito": "Fuddler",
    "Leezpunk": "Tanzee",
    "Leezpunk Ignis": "Kelpsea",
    "Loupmoon": "Wixen",
    "Galeclaw": "Dazzi",
    "Robinquill": "Woolipop",
    "Robinquill Terra": "Woolipop",
    "Gorirat": "Dazzi",
    "Beegarde": "Fuddler",
    "Elizabee": "Digtoise",
    "Grintale": "Lovander",
    "Swee": "Tocotoco",
    "Sweepa": "Melpaca",
    "Chillet": "Gobfin",
    "Univolt": "Galeclaw",
    "Foxcicle": "Direhowl",
    "Pyrin": "Broncherry",
    "Pyrin Noct": "Chillet",
    "Reindrix": "Rushoar",
    "Rayhound": "Direhowl",
    "Kitsun": "Lunaris",
    "Dazzi": "Killamari",
    "Lunaris": "Gumoss",
    "Dinossom": "Gobfin",
    "Dinossom Lux": "Gobfin",
    "Surfent": "Loupmoon",
    "Surfent Terra": "Loupmoon",
    "Maraith": "Kelpsea",
    "Digtoise": "Lunaris",
    "Tombat": "Direhowl",
    "Lovander": "Rooby",
    "Flambelle": "Hoocrates",
    "Vanwyrm": "Robinquill",
    "Vanwyrm Cryst": "Verdash",
    "Bushi": "Felbat",
    "Beakon": "Arsox",
    "Ragnahawk": "Reindrix",
    "Katress": "Galeclaw",
    "Wixen": "Kelpsea",
    "Verdash": "Nox",
    "Vaelet": "Dazzi",
    "Sibelyx": "Mozzarina",
    "Elphidran": "Loupmoon",
    "Elphidran Aqua": "Loupmoon",
    "Kelpsea": "Bristla",
    "Kelpsea Ignis": "Bristla",
    "Azurobe": "Caprity",
    "Cryolinx": "Tombat",
    "Blazehowl": "Gorirat",
    "Blazehowl Noct": "Robinquill",
    "Relaxaurus": "Kitsun",
    "Relaxaurus Lux": "Dinossom",
    "Broncherry": "Lunaris",
    "Broncherry Aqua": "Lunaris",
    "Petallia": "Cawgnito",
    "Reptyro": "Digtoise",
    "Ice Reptyro": "Chillet",
    "Kingpaca": "Eikthyrdeer",
    "Ice Kingpaca": "Mozzarina",
    "Mammorest": "Kitsun",
    "Mammorest Cryst": "Kitsun",
    "Wumpo": "Eikthyrdeer",
    "Wumpo Botan": "Eikthyrdeer",
    "Warsect": "Digtoise",
    "Fenglope": "Nox",
    "Felbat": "Woolipop",
    "Quivern": "Broncherry",
    "Blazamut": "Univolt",
    "Helzephyr": "Petallia",
    "Astegon": "Foxcicle",
    "Menasting": "Dinossom",
    "Anubis": "Fenglope",
    "Jormuntide": "Digtoise",
    "Jormuntide Ignis": "Digtoise",
    "Suzaku": "Blazehowl",
    "Suzaku Aqua": "Katress",
    "Grizzbolt": "Arsox",
    "Lyleen": "Dinossom",
    "Lyleen Noct": "Arsox",
    "Faleris": "Celaray",
    "Orserk": "Tombat",
    "Shadowbeak": "Blazehowl",
    "Paladius": "Rayhound",
    "Necromus": "Blazehowl",
    "Frostallion": "Tombat",
    "Frostallion Noct": "Rayhound",
    "Jetragon": "Rayhound"
  },
  "Jolthog Cryst": {
    "variant": true,
    "Lamball": "Hangyu",
    "Cattiva": "Sparkit",
    "Chikipi": "Lifmunk",
    "Lifmunk": "Foxparks",
    "Foxparks": "Depresso",
    "Fuack": "Tocotoco",
    "Sparkit": "Depresso",
    "Tanzee": "Swee",
    "Rooby": "Kelpsea",
    "Pengullet": "Pengullet",
    "Penking": "Lovander",
    "Jolthog": "Jolthog",
    "Jolthog Cryst": "Jolthog Cryst",
    "Gumoss": "Swee",
    "Gumoss (Special)": "Swee",
    "Vixy": "Flambelle",
    "Hoocrates": "Jolthog",
    "Teafant": "Lifmunk",
    "Depresso": "Jolthog",
    "Cremis": "Sparkit",
    "Daedream": "Killamari",
    "Rushoar": "Tanzee",
    "Nox": "Kelpsea Ignis",
    "Fuddler": "Killamari",
    "Killamari": "Bristla",
    "Mau": "Hangyu",
    "Mau Cryst": "Foxparks",
    "Celaray": "Lunaris",
    "Direhowl": "Dazzi",
    "Tocotoco": "Pengullet",
    "Flopie": "Bristla",
    "Mozzarina": "Rushoar",
    "Bristla": "Tocotoco",
    "Gobfin": "Fuddler",
    "Gobfin Ignis": "Daedream",
    "Hangyu": "Hoocrates",
    "Hangyu Cryst": "Hoocrates",
    "Mossanda": "Dumud",
    "Mossanda Lux": "Reindrix",
    "Woolipop": "Kelpsea Ignis",
    "Caprity": "Maraith",
    "Melpaca": "Rushoar",
    "Eikthyrdeer": "Rushoar",
    "Eikthyrdeer Terra": "Rushoar",
    "Nitewing": "Melpaca",
    "Ribunny": "Tocotoco",
    "Incineram": "Fenglope",
    "Incineram Noct": "Fenglope",
    "Cinnamoth": "Eikthyrdeer",
    "Arsox": "Cawgnito",
    "Dumud": "Rushoar",
    "Cawgnito": "Fuddler",
    "Leezpunk": "Gumoss",
    "Leezpunk Ignis": "Tanzee",
    "Loupmoon": "Rooby",
    "Galeclaw": "Woolipop",
    "Robinquill": "Woolipop",
    "Robinquill Terra": "Nox",
    "Gorirat": "Dazzi",
    "Beegarde": "Dazzi",
    "Elizabee": "Digtoise",
    "Grintale": "Caprity",
    "Swee": "Fuack",
    "Sweepa": "Melpaca",
    "Chillet": "Cawgnito",
    "Univolt": "Robinquill",
    "Foxcicle": "Direhowl",
    "Pyrin": "Broncherry",
    "Pyrin Noct": "Chillet",
    "Reindrix": "Leezpunk",
    "Rayhound": "Vaelet",
    "Kitsun": "Gobfin",
    "Dazzi": "Killamari",
    "Lunaris": "Daedream",
    "Dinossom": "Gobfin",
    "Dinossom Lux": "Gobfin",
    "Surfent": "Loupmoon",
    "Surfent Terra": "Loupmoon",
    "Maraith": "Kelpsea",
    "Digtoise": "Lunaris",
    "Tombat": "Direhowl",
    "Lovander": "Maraith",
    "Flambelle": "Depresso",
    "Vanwyrm": "Felbat",
    "Vanwyrm Cryst": "Verdash",
    "Bushi": "Felbat",
    "Beakon": "Arsox",
    "Ragnahawk": "Celaray",
    "Katress": "Galeclaw",
    "Wixen": "Kelpsea",
    "Verdash": "Nox",
    "Vaelet": "Dazzi",
    "Sibelyx": "Mozzarina",
    "Elphidran": "Loupmoon",
    "Elphidran Aqua": "Loupmoon",
    "Kelpsea": "Ribunny",
    "Kelpsea Ignis": "Bristla",
    "Azurobe": "Caprity",
    "Cryolinx": "Tombat",
    "Blazehowl": "Galeclaw",
    "Blazehowl Noct": "Robinquill",
    "Relaxaurus": "Dinossom",
    "Relaxaurus Lux": "Dinossom",
    "Broncherry": "Lunaris",
    "Broncherry Aqua": "Lunaris",
    "Petallia": "Beegarde",
    "Reptyro": "Digtoise",
    "Ice Reptyro": "Arsox",
    "Kingpaca": "Eikthyrdeer",
    "Ice Kingpaca": "Dumud",
    "Mammorest": "Kitsun",
    "Mammorest Cryst": "Kitsun",
    "Wumpo": "Mozzarina",
    "Wumpo Botan": "Eikthyrdeer",
    "Warsect": "Digtoise",
    "Fenglope": "Wixen",
    "Felbat": "Woolipop",
    "Quivern": "Digtoise",
    "Blazamut": "Univolt",
    "Helzephyr": "Petallia",
    "Astegon": "Tombat",
    "Menasting": "Dinossom",
    "Anubis": "Loupmoon",
    "Jormuntide": "Kitsun",
    "Jormuntide Ignis": "Kitsun",
    "Suzaku": "Blazehowl",
    "Suzaku Aqua": "Katress",
    "Grizzbolt": "Petallia",
    "Lyleen": "Chillet",
    "Lyleen Noct": "Arsox",
    "Faleris": "Broncherry",
    "Orserk": "Tombat",
    "Shadowbeak": "Blazehowl",
    "Paladius": "Blazehowl",
    "Necromus": "Blazehowl",
    "Frostallion": "Rayhound",
    "Frostallion Noct": "Rayhound",
    "Jetragon": "Rayhound"
  },
  "Gumoss": {
    "Lamball": "Pengullet",
    "Cattiva": "Pengullet",
    "Chikipi": "Jolthog",
    "Lifmunk": "Tocotoco",
    "Foxparks": "Bristla",
    "Fuack": "Killamari",
    "Sparkit": "Bristla",
    "Tanzee": "Tanzee",
    "Rooby": "Woolipop",
    "Pengullet": "Killamari",
    "Penking": "Reindrix",
    "Jolthog": "Swee",
    "Jolthog Cryst": "Swee",
    "Gumoss": "Gumoss",
    "Gumoss (Special)": "Gumoss",
    "Vixy": "Tocotoco",
    "Hoocrates": "Bristla",
    "Teafant": "Jolthog",
    "Depresso": "Ribunny",
    "Cremis": "Pengullet",
    "Daedream": "Daedream",
    "Rushoar": "Woolipop",
    "Nox": "Dazzi",
    "Fuddler": "Daedream",
    "Killamari": "Kelpsea",
    "Mau": "Jolthog",
    "Mau Cryst": "Tocotoco",
    "Celaray": "Direhowl",
    "Direhowl": "Maraith",
    "Tocotoco": "Killamari",
    "Flopie": "Kelpsea",
    "Mozzarina": "Cawgnito",
    "Bristla": "Flopie",
    "Gobfin": "Wixen",
    "Gobfin Ignis": "Wixen",
    "Hangyu": "Fuack",
    "Hangyu Cryst": "Fuack",
    "Mossanda": "Kitsun",
    "Mossanda Lux": "Dinossom",
    "Woolipop": "Dazzi",
    "Caprity": "Gobfin",
    "Melpaca": "Direhowl",
    "Eikthyrdeer": "Cawgnito",
    "Eikthyrdeer Terra": "Beegarde",
    "Nitewing": "Kitsun",
    "Ribunny": "Kelpsea Ignis",
    "Incineram": "Eikthyrdeer",
    "Incineram Noct": "Mozzarina",
    "Cinnamoth": "Broncherry",
    "Arsox": "Robinquill",
    "Dumud": "Beegarde",
    "Cawgnito": "Wixen",
    "Leezpunk": "Nox",
    "Leezpunk Ignis": "Woolipop",
    "Loupmoon": "Gobfin",
    "Galeclaw": "Rushoar",
    "Robinquill": "Rushoar",
    "Robinquill Terra": "Leezpunk",
    "Gorirat": "Rushoar",
    "Beegarde": "Rooby",
    "Elizabee": "Arsox",
    "Grintale": "Reindrix",
    "Swee": "Kelpsea Ignis",
    "Sweepa": "Kitsun",
    "Chillet": "Robinquill",
    "Univolt": "Loupmoon",
    "Foxcicle": "Felbat",
    "Pyrin": "Chillet",
    "Pyrin Noct": "Rayhound",
    "Reindrix": "Direhowl",
    "Rayhound": "Verdash",
    "Kitsun": "Galeclaw",
    "Dazzi": "Fuddler",
    "Lunaris": "Nox",
    "Dinossom": "Galeclaw",
    "Dinossom Lux": "Galeclaw",
    "Surfent": "Dumud",
    "Surfent Terra": "Dumud",
    "Maraith": "Woolipop",
    "Digtoise": "Gorirat",
    "Tombat": "Verdash",
    "Lovander": "Gobfin",
    "Flambelle": "Bristla",
    "Vanwyrm": "Loupmoon",
    "Vanwyrm Cryst": "Caprity",
    "Bushi": "Lovander",
    "Beakon": "Rayhound",
    "Ragnahawk": "Dinossom",
    "Katress": "Fenglope",
    "Wixen": "Dazzi",
    "Verdash": "Lunaris",
    "Vaelet": "Maraith",
    "Sibelyx": "Digtoise",
    "Elphidran": "Melpaca",
    "Elphidran Aqua": "Melpaca",
    "Kelpsea": "Tanzee",
    "Kelpsea Ignis": "Kelpsea",
    "Azurobe": "Celaray",
    "Cryolinx": "Univolt",
    "Blazehowl": "Fenglope",
    "Blazehowl Noct": "Loupmoon",
    "Relaxaurus": "Foxcicle",
    "Relaxaurus Lux": "Tombat",
    "Broncherry": "Vaelet",
    "Broncherry Aqua": "Gorirat",
    "Petallia": "Felbat",
    "Reptyro": "Petallia",
    "Ice Reptyro": "Rayhound",
    "Kingpaca": "Digtoise",
    "Ice Kingpaca": "Digtoise",
    "Mammorest": "Foxcicle",
    "Mammorest Cryst": "Foxcicle",
    "Wumpo": "Digtoise",
    "Wumpo Botan": "Broncherry",
    "Warsect": "Arsox",
    "Fenglope": "Lunaris",
    "Felbat": "Rushoar",
    "Quivern": "Arsox",
    "Blazamut": "Bushi",
    "Helzephyr": "Blazehowl",
    "Astegon": "Katress",
    "Menasting": "Tombat",
    "Anubis": "Mozzarina",
    "Jormuntide": "Petallia",
    "Jormuntide Ignis": "Petallia",
    "Suzaku": "Bushi",
    "Suzaku Aqua": "Bushi",
    "Grizzbolt": "Blazehowl",
    "Lyleen": "Tombat",
    "Lyleen Noct": "Rayhound",
    "Faleris": "Chillet",
    "Orserk": "Univolt",
    "Shadowbeak": "Vanwyrm",
    "Paladius": "Vanwyrm",
    "Necromus": "Vanwyrm",
    "Frostallion": "Univolt",
    "Frostallion Noct": "Univolt",
    "Jetragon": "Vanwyrm"
  },
  "Gumoss (Special)": {
    "Lamball": "Pengullet",
    "Cattiva": "Pengullet",
    "Chikipi": "Jolthog",
    "Lifmunk": "Tocotoco",
    "Foxparks": "Bristla",
    "Fuack": "Killamari",
    "Sparkit": "Bristla",
    "Tanzee": "Tanzee",
    "Rooby": "Woolipop",
    "Pengullet": "Killamari",
    "Penking": "Reindrix",
    "Jolthog": "Swee",
    "Jolthog Cryst": "Swee",
    "Gumoss": "Gumoss",
    "Gumoss (Special)": "Gumoss (Special)",
    "Vixy": "Tocotoco",
    "Hoocrates": "Bristla",
    "Teafant": "Jolthog",
    "Depresso": "Ribunny",
    "Cremis": "Pengullet",
    "Daedream": "Daedream",
    "Rushoar": "Woolipop",
    "Nox": "Dazzi",
    "Fuddler": "Daedream",
    "Killamari": "Kelpsea",
    "Mau": "Jolthog",
    "Mau Cryst": "Tocotoco",
    "Celaray": "Direhowl",
    "Direhowl": "Maraith",
    "Tocotoco": "Killamari",
    "Flopie": "Kelpsea",
    "Mozzarina": "Cawgnito",
    "Bristla": "Flopie",
    "Gobfin": "Wixen",
    "Gobfin Ignis": "Wixen",
    "Hangyu": "Fuack",
    "Hangyu Cryst": "Fuack",
    "Mossanda": "Kitsun",
    "Mossanda Lux": "Dinossom",
    "Woolipop": "Dazzi",
    "Caprity": "Gobfin",
    "Melpaca": "Direhowl",
    "Eikthyrdeer": "Cawgnito",
    "Eikthyrdeer Terra": "Beegarde",
    "Nitewing": "Kitsun",
    "Ribunny": "Kelpsea Ignis",
    "Incineram": "Eikthyrdeer",
    "Incineram Noct": "Mozzarina",
    "Cinnamoth": "Broncherry",
    "Arsox": "Robinquill",
    "Dumud": "Beegarde",
    "Cawgnito": "Wixen",
    "Leezpunk": "Nox",
    "Leezpunk Ignis": "Woolipop",
    "Loupmoon": "Gobfin",
    "Galeclaw": "Rushoar",
    "Robinquill": "Rushoar",
    "Robinquill Terra": "Leezpunk",
    "Gorirat": "Rushoar",
    "Beegarde": "Rooby",
    "Elizabee": "Arsox",
    "Grintale": "Reindrix",
    "Swee": "Kelpsea Ignis",
    "Sweepa": "Kitsun",
    "Chillet": "Robinquill",
    "Univolt": "Loupmoon",
    "Foxcicle": "Felbat",
    "Pyrin": "Chillet",
    "Pyrin Noct": "Rayhound",
    "Reindrix": "Direhowl",
    "Rayhound": "Verdash",
    "Kitsun": "Galeclaw",
    "Dazzi": "Fuddler",
    "Lunaris": "Nox",
    "Dinossom": "Galeclaw",
    "Dinossom Lux": "Galeclaw",
    "Surfent": "Dumud",
    "Surfent Terra": "Dumud",
    "Maraith": "Woolipop",
    "Digtoise": "Gorirat",
    "Tombat": "Verdash",
    "Lovander": "Gobfin",
    "Flambelle": "Bristla",
    "Vanwyrm": "Loupmoon",
    "Vanwyrm Cryst": "Caprity",
    "Bushi": "Lovander",
    "Beakon": "Rayhound",
    "Ragnahawk": "Dinossom",
    "Katress": "Fenglope",
    "Wixen": "Dazzi",
    "Verdash": "Lunaris",
    "Vaelet": "Maraith",
    "Sibelyx": "Digtoise",
    "Elphidran": "Melpaca",
    "Elphidran Aqua": "Melpaca",
    "Kelpsea": "Tanzee",
    "Kelpsea Ignis": "Kelpsea",
    "Azurobe": "Celaray",
    "Cryolinx": "Univolt",
    "Blazehowl": "Fenglope",
    "Blazehowl Noct": "Loupmoon",
    "Relaxaurus": "Foxcicle",
    "Relaxaurus Lux": "Tombat",
    "Broncherry": "Vaelet",
    "Broncherry Aqua": "Gorirat",
    "Petallia": "Felbat",
    "Reptyro": "Petallia",
    "Ice Reptyro": "Rayhound",
    "Kingpaca": "Digtoise",
    "Ice Kingpaca": "Digtoise",
    "Mammorest": "Foxcicle",
    "Mammorest Cryst": "Foxcicle",
    "Wumpo": "Digtoise",
    "Wumpo Botan": "Broncherry",
    "Warsect": "Arsox",
    "Fenglope": "Lunaris",
    "Felbat": "Rushoar",
    "Quivern": "Arsox",
    "Blazamut": "Bushi",
    "Helzephyr": "Blazehowl",
    "Astegon": "Katress",
    "Menasting": "Tombat",
    "Anubis": "Mozzarina",
    "Jormuntide": "Petallia",
    "Jormuntide Ignis": "Petallia",
    "Suzaku": "Bushi",
    "Suzaku Aqua": "Bushi",
    "Grizzbolt": "Blazehowl",
    "Lyleen": "Tombat",
    "Lyleen Noct": "Rayhound",
    "Faleris": "Chillet",
    "Orserk": "Univolt",
    "Shadowbeak": "Vanwyrm",
    "Paladius": "Vanwyrm",
    "Necromus": "Vanwyrm",
    "Frostallion": "Univolt",
    "Frostallion Noct": "Univolt",
    "Jetragon": "Vanwyrm"
  },
  "Vixy": {
    "Lamball": "Cattiva",
    "Cattiva": "Cremis",
    "Chikipi": "Mau",
    "Lifmunk": "Lifmunk",
    "Foxparks": "Lifmunk",
    "Fuack": "Hoocrates",
    "Sparkit": "Lifmunk",
    "Tanzee": "Pengullet",
    "Rooby": "Swee",
    "Pengullet": "Foxparks",
    "Penking": "Fenglope",
    "Jolthog": "Sparkit",
    "Jolthog Cryst": "Flambelle",
    "Gumoss": "Tocotoco",
    "Gumoss (Special)": "Tocotoco",
    "Vixy": "Vixy",
    "Hoocrates": "Hangyu",
    "Teafant": "Lamball",
    "Depresso": "Hangyu",
    "Cremis": "Cremis",
    "Daedream": "Tocotoco",
    "Rushoar": "Killamari",
    "Nox": "Bristla",
    "Fuddler": "Tocotoco",
    "Killamari": "Jolthog",
    "Mau": "Lamball",
    "Mau Cryst": "Vixy",
    "Celaray": "Wixen",
    "Direhowl": "Kelpsea",
    "Tocotoco": "Foxparks",
    "Flopie": "Jolthog",
    "Mozzarina": "Nox",
    "Bristla": "Depresso",
    "Gobfin": "Kelpsea Ignis",
    "Gobfin Ignis": "Kelpsea Ignis",
    "Hangyu": "Lifmunk",
    "Hangyu Cryst": "Lifmunk",
    "Mossanda": "Lovander",
    "Mossanda Lux": "Eikthyrdeer",
    "Woolipop": "Bristla",
    "Caprity": "Woolipop",
    "Melpaca": "Wixen",
    "Eikthyrdeer": "Woolipop",
    "Eikthyrdeer Terra": "Nox",
    "Nitewing": "Caprity",
    "Ribunny": "Depresso",
    "Incineram": "Robinquill",
    "Incineram Noct": "Robinquill",
    "Cinnamoth": "Fenglope",
    "Arsox": "Leezpunk",
    "Dumud": "Nox",
    "Cawgnito": "Kelpsea",
    "Leezpunk": "Killamari",
    "Leezpunk Ignis": "Killamari",
    "Loupmoon": "Dazzi",
    "Galeclaw": "Gumoss",
    "Robinquill": "Daedream",
    "Robinquill Terra": "Fuddler",
    "Gorirat": "Tanzee",
    "Beegarde": "Kelpsea",
    "Elizabee": "Melpaca",
    "Grintale": "Fenglope",
    "Swee": "Jolthog",
    "Sweepa": "Caprity",
    "Chillet": "Rushoar",
    "Univolt": "Direhowl",
    "Foxcicle": "Lunaris",
    "Pyrin": "Mozzarina",
    "Pyrin Noct": "Digtoise",
    "Reindrix": "Wixen",
    "Rayhound": "Gobfin",
    "Kitsun": "Rushoar",
    "Dazzi": "Fuack",
    "Lunaris": "Flopie",
    "Dinossom": "Rushoar",
    "Dinossom Lux": "Rushoar",
    "Surfent": "Felbat",
    "Surfent Terra": "Felbat",
    "Maraith": "Swee",
    "Digtoise": "Maraith",
    "Tombat": "Lunaris",
    "Lovander": "Woolipop",
    "Flambelle": "Lifmunk",
    "Vanwyrm": "Direhowl",
    "Vanwyrm Cryst": "Galeclaw",
    "Bushi": "Gorirat",
    "Beakon": "Kitsun",
    "Ragnahawk": "Eikthyrdeer",
    "Katress": "Cawgnito",
    "Wixen": "Swee",
    "Verdash": "Fuddler",
    "Vaelet": "Tanzee",
    "Sibelyx": "Loupmoon",
    "Elphidran": "Verdash",
    "Elphidran Aqua": "Verdash",
    "Kelpsea": "Pengullet",
    "Kelpsea Ignis": "Jolthog",
    "Azurobe": "Fenglope",
    "Cryolinx": "Arsox",
    "Blazehowl": "Cawgnito",
    "Blazehowl Noct": "Direhowl",
    "Relaxaurus": "Broncherry",
    "Relaxaurus Lux": "Broncherry",
    "Broncherry": "Rooby",
    "Broncherry Aqua": "Maraith",
    "Petallia": "Lunaris",
    "Reptyro": "Melpaca",
    "Ice Reptyro": "Digtoise",
    "Kingpaca": "Loupmoon",
    "Ice Kingpaca": "Loupmoon",
    "Mammorest": "Reindrix",
    "Mammorest Cryst": "Celaray",
    "Wumpo": "Loupmoon",
    "Wumpo Botan": "Loupmoon",
    "Warsect": "Dumud",
    "Fenglope": "Dazzi",
    "Felbat": "Daedream",
    "Quivern": "Dumud",
    "Blazamut": "Rayhound",
    "Helzephyr": "Dinossom",
    "Astegon": "Chillet",
    "Menasting": "Digtoise",
    "Anubis": "Felbat",
    "Jormuntide": "Reindrix",
    "Jormuntide Ignis": "Reindrix",
    "Suzaku": "Tombat",
    "Suzaku Aqua": "Rayhound",
    "Grizzbolt": "Kitsun",
    "Lyleen": "Digtoise",
    "Lyleen Noct": "Kitsun",
    "Faleris": "Mozzarina",
    "Orserk": "Arsox",
    "Shadowbeak": "Tombat",
    "Paladius": "Foxcicle",
    "Necromus": "Foxcicle",
    "Frostallion": "Arsox",
    "Frostallion Noct": "Petallia",
    "Jetragon": "Foxcicle"
  },
  "Hoocrates": {
    "Lamball": "Lifmunk",
    "Cattiva": "Lifmunk",
    "Chikipi": "Vixy",
    "Lifmunk": "Sparkit",
    "Foxparks": "Foxparks",
    "Fuack": "Jolthog",
    "Sparkit": "Foxparks",
    "Tanzee": "Bristla",
    "Rooby": "Kelpsea Ignis",
    "Pengullet": "Jolthog",
    "Penking": "Loupmoon",
    "Jolthog": "Depresso",
    "Jolthog Cryst": "Jolthog",
    "Gumoss": "Bristla",
    "Gumoss (Special)": "Bristla",
    "Vixy": "Hangyu",
    "Hoocrates": "Hoocrates",
    "Teafant": "Lifmunk",
    "Depresso": "Depresso",
    "Cremis": "Hangyu",
    "Daedream": "Ribunny",
    "Rushoar": "Kelpsea",
    "Nox": "Killamari",
    "Fuddler": "Swee",
    "Killamari": "Tocotoco",
    "Mau": "Lifmunk",
    "Mau Cryst": "Hangyu",
    "Celaray": "Rushoar",
    "Direhowl": "Fuddler",
    "Tocotoco": "Jolthog",
    "Flopie": "Tocotoco",
    "Mozzarina": "Maraith",
    "Bristla": "Pengullet",
    "Gobfin": "Gumoss",
    "Gobfin Ignis": "Tanzee",
    "Hangyu": "Flambelle",
    "Hangyu Cryst": "Flambelle",
    "Mossanda": "Mozzarina",
    "Mossanda Lux": "Melpaca",
    "Woolipop": "Killamari",
    "Caprity": "Wixen",
    "Melpaca": "Rushoar",
    "Eikthyrdeer": "Rooby",
    "Eikthyrdeer Terra": "Maraith",
    "Nitewing": "Mozzarina",
    "Ribunny": "Pengullet",
    "Incineram": "Verdash",
    "Incineram Noct": "Fenglope",
    "Cinnamoth": "Lovander",
    "Arsox": "Gobfin",
    "Dumud": "Maraith",
    "Cawgnito": "Daedream",
    "Leezpunk": "Kelpsea",
    "Leezpunk Ignis": "Kelpsea",
    "Loupmoon": "Wixen",
    "Galeclaw": "Dazzi",
    "Robinquill": "Dazzi",
    "Robinquill Terra": "Woolipop",
    "Gorirat": "Dazzi",
    "Beegarde": "Daedream",
    "Elizabee": "Broncherry",
    "Grintale": "Loupmoon",
    "Swee": "Tocotoco",
    "Sweepa": "Dumud",
    "Chillet": "Gobfin",
    "Univolt": "Galeclaw",
    "Foxcicle": "Cawgnito",
    "Pyrin": "Reindrix",
    "Pyrin Noct": "Dinossom",
    "Reindrix": "Rushoar",
    "Rayhound": "Direhowl",
    "Kitsun": "Lunaris",
    "Dazzi": "Swee",
    "Lunaris": "Tanzee",
    "Dinossom": "Lunaris",
    "Dinossom Lux": "Lunaris",
    "Surfent": "Fenglope",
    "Surfent Terra": "Fenglope",
    "Maraith": "Kelpsea Ignis",
    "Digtoise": "Leezpunk",
    "Tombat": "Beegarde",
    "Lovander": "Wixen",
    "Flambelle": "Foxparks",
    "Vanwyrm": "Galeclaw",
    "Vanwyrm Cryst": "Felbat",
    "Bushi": "Robinquill",
    "Beakon": "Chillet",
    "Ragnahawk": "Melpaca",
    "Katress": "Gorirat",
    "Wixen": "Kelpsea Ignis",
    "Verdash": "Woolipop",
    "Vaelet": "Fuddler",
    "Sibelyx": "Eikthyrdeer",
    "Elphidran": "Loupmoon",
    "Elphidran Aqua": "Loupmoon",
    "Kelpsea": "Bristla",
    "Kelpsea Ignis": "Fuack",
    "Azurobe": "Loupmoon",
    "Cryolinx": "Foxcicle",
    "Blazehowl": "Vaelet",
    "Blazehowl Noct": "Galeclaw",
    "Relaxaurus": "Kitsun",
    "Relaxaurus Lux": "Kitsun",
    "Broncherry": "Rushoar",
    "Broncherry Aqua": "Lunaris",
    "Petallia": "Gobfin",
    "Reptyro": "Digtoise",
    "Ice Reptyro": "Dinossom",
    "Kingpaca": "Caprity",
    "Ice Kingpaca": "Eikthyrdeer",
    "Mammorest": "Digtoise",
    "Mammorest Cryst": "Digtoise",
    "Wumpo": "Eikthyrdeer",
    "Wumpo Botan": "Caprity",
    "Warsect": "Broncherry",
    "Fenglope": "Woolipop",
    "Felbat": "Dazzi",
    "Quivern": "Celaray",
    "Blazamut": "Katress",
    "Helzephyr": "Arsox",
    "Astegon": "Foxcicle",
    "Menasting": "Kitsun",
    "Anubis": "Fenglope",
    "Jormuntide": "Digtoise",
    "Jormuntide Ignis": "Digtoise",
    "Suzaku": "Blazehowl",
    "Suzaku Aqua": "Blazehowl",
    "Grizzbolt": "Arsox",
    "Lyleen": "Dinossom",
    "Lyleen Noct": "Chillet",
    "Faleris": "Reindrix",
    "Orserk": "Foxcicle",
    "Shadowbeak": "Rayhound",
    "Paladius": "Rayhound",
    "Necromus": "Rayhound",
    "Frostallion": "Tombat",
    "Frostallion Noct": "Tombat",
    "Jetragon": "Rayhound"
  },
  "Teafant": {
    "Lamball": "Mau",
    "Cattiva": "Mau",
    "Chikipi": "Teafant",
    "Lifmunk": "Cattiva",
    "Foxparks": "Vixy",
    "Fuack": "Sparkit",
    "Sparkit": "Vixy",
    "Tanzee": "Jolthog",
    "Rooby": "Bristla",
    "Pengullet": "Hangyu",
    "Penking": "Felbat",
    "Jolthog": "Lifmunk",
    "Jolthog Cryst": "Lifmunk",
    "Gumoss": "Jolthog",
    "Gumoss (Special)": "Jolthog",
    "Vixy": "Lamball",
    "Hoocrates": "Lifmunk",
    "Teafant": "Teafant",
    "Depresso": "Lifmunk",
    "Cremis": "Lamball",
    "Daedream": "Jolthog",
    "Rushoar": "Ribunny",
    "Nox": "Tocotoco",
    "Fuddler": "Pengullet",
    "Killamari": "Hoocrates",
    "Mau": "Mau",
    "Mau Cryst": "Lamball",
    "Celaray": "Nox",
    "Direhowl": "Kelpsea Ignis",
    "Tocotoco": "Hangyu",
    "Flopie": "Depresso",
    "Mozzarina": "Dazzi",
    "Bristla": "Flambelle",
    "Gobfin": "Killamari",
    "Gobfin Ignis": "Killamari",
    "Hangyu": "Cremis",
    "Hangyu Cryst": "Cremis",
    "Mossanda": "Loupmoon",
    "Mossanda Lux": "Lovander",
    "Woolipop": "Tocotoco",
    "Caprity": "Dazzi",
    "Melpaca": "Woolipop",
    "Eikthyrdeer": "Dazzi",
    "Eikthyrdeer Terra": "Woolipop",
    "Nitewing": "Loupmoon",
    "Ribunny": "Foxparks",
    "Incineram": "Gorirat",
    "Incineram Noct": "Galeclaw",
    "Cinnamoth": "Verdash",
    "Arsox": "Rushoar",
    "Dumud": "Woolipop",
    "Cawgnito": "Killamari",
    "Leezpunk": "Swee",
    "Leezpunk Ignis": "Bristla",
    "Loupmoon": "Fuddler",
    "Galeclaw": "Kelpsea",
    "Robinquill": "Kelpsea",
    "Robinquill Terra": "Tanzee",
    "Gorirat": "Kelpsea",
    "Beegarde": "Flopie",
    "Elizabee": "Mozzarina",
    "Grintale": "Felbat",
    "Swee": "Foxparks",
    "Sweepa": "Loupmoon",
    "Chillet": "Maraith",
    "Univolt": "Gobfin",
    "Foxcicle": "Rushoar",
    "Pyrin": "Eikthyrdeer",
    "Pyrin Noct": "Broncherry",
    "Reindrix": "Woolipop",
    "Rayhound": "Lunaris",
    "Kitsun": "Wixen",
    "Dazzi": "Pengullet",
    "Lunaris": "Swee",
    "Dinossom": "Rooby",
    "Dinossom Lux": "Maraith",
    "Surfent": "Galeclaw",
    "Surfent Terra": "Robinquill",
    "Maraith": "Bristla",
    "Digtoise": "Wixen",
    "Tombat": "Leezpunk",
    "Lovander": "Dazzi",
    "Flambelle": "Vixy",
    "Vanwyrm": "Cawgnito",
    "Vanwyrm Cryst": "Direhowl",
    "Bushi": "Direhowl",
    "Beakon": "Digtoise",
    "Ragnahawk": "Caprity",
    "Katress": "Gobfin",
    "Wixen": "Bristla",
    "Verdash": "Gumoss",
    "Vaelet": "Kelpsea Ignis",
    "Sibelyx": "Fenglope",
    "Elphidran": "Robinquill",
    "Elphidran Aqua": "Felbat",
    "Kelpsea": "Jolthog",
    "Kelpsea Ignis": "Depresso",
    "Azurobe": "Verdash",
    "Cryolinx": "Dinossom",
    "Blazehowl": "Lunaris",
    "Blazehowl Noct": "Cawgnito",
    "Relaxaurus": "Melpaca",
    "Relaxaurus Lux": "Reindrix",
    "Broncherry": "Nox",
    "Broncherry Aqua": "Wixen",
    "Petallia": "Rushoar",
    "Reptyro": "Mozzarina",
    "Ice Reptyro": "Broncherry",
    "Kingpaca": "Fenglope",
    "Ice Kingpaca": "Loupmoon",
    "Mammorest": "Dumud",
    "Mammorest Cryst": "Melpaca",
    "Wumpo": "Fenglope",
    "Wumpo Botan": "Fenglope",
    "Warsect": "Eikthyrdeer",
    "Fenglope": "Daedream",
    "Felbat": "Tanzee",
    "Quivern": "Eikthyrdeer",
    "Blazamut": "Tombat",
    "Helzephyr": "Digtoise",
    "Astegon": "Dinossom",
    "Menasting": "Reindrix",
    "Anubis": "Galeclaw",
    "Jormuntide": "Dumud",
    "Jormuntide Ignis": "Mozzarina",
    "Suzaku": "Foxcicle",
    "Suzaku Aqua": "Foxcicle",
    "Grizzbolt": "Digtoise",
    "Lyleen": "Celaray",
    "Lyleen Noct": "Digtoise",
    "Faleris": "Caprity",
    "Orserk": "Dinossom",
    "Shadowbeak": "Petallia",
    "Paladius": "Arsox",
    "Necromus": "Petallia",
    "Frostallion": "Chillet",
    "Frostallion Noct": "Arsox",
    "Jetragon": "Arsox"
  },
  "Depresso": {
    "Lamball": "Lifmunk",
    "Cattiva": "Hangyu",
    "Chikipi": "Lifmunk",
    "Lifmunk": "Flambelle",
    "Foxparks": "Hoocrates",
    "Fuack": "Pengullet",
    "Sparkit": "Foxparks",
    "Tanzee": "Bristla",
    "Rooby": "Kelpsea Ignis",
    "Pengullet": "Jolthog",
    "Penking": "Loupmoon",
    "Jolthog": "Jolthog",
    "Jolthog Cryst": "Jolthog",
    "Gumoss": "Ribunny",
    "Gumoss (Special)": "Ribunny",
    "Vixy": "Hangyu",
    "Hoocrates": "Depresso",
    "Teafant": "Lifmunk",
    "Depresso": "Depresso",
    "Cremis": "Hangyu",
    "Daedream": "Swee",
    "Rushoar": "Kelpsea",
    "Nox": "Flopie",
    "Fuddler": "Swee",
    "Killamari": "Tocotoco",
    "Mau": "Lifmunk",
    "Mau Cryst": "Sparkit",
    "Celaray": "Rushoar",
    "Direhowl": "Fuddler",
    "Tocotoco": "Jolthog",
    "Flopie": "Fuack",
    "Mozzarina": "Maraith",
    "Bristla": "Pengullet",
    "Gobfin": "Daedream",
    "Gobfin Ignis": "Gumoss",
    "Hangyu": "Foxparks",
    "Hangyu Cryst": "Foxparks",
    "Mossanda": "Mozzarina",
    "Mossanda Lux": "Melpaca",
    "Woolipop": "Killamari",
    "Caprity": "Rooby",
    "Melpaca": "Rushoar",
    "Eikthyrdeer": "Maraith",
    "Eikthyrdeer Terra": "Rushoar",
    "Nitewing": "Dumud",
    "Ribunny": "Tocotoco",
    "Incineram": "Fenglope",
    "Incineram Noct": "Fenglope",
    "Cinnamoth": "Caprity",
    "Arsox": "Gobfin",
    "Dumud": "Rushoar",
    "Cawgnito": "Daedream",
    "Leezpunk": "Tanzee",
    "Leezpunk Ignis": "Kelpsea",
    "Loupmoon": "Wixen",
    "Galeclaw": "Dazzi",
    "Robinquill": "Dazzi",
    "Robinquill Terra": "Woolipop",
    "Gorirat": "Dazzi",
    "Beegarde": "Fuddler",
    "Elizabee": "Digtoise",
    "Grintale": "Loupmoon",
    "Swee": "Tocotoco",
    "Sweepa": "Dumud",
    "Chillet": "Gobfin",
    "Univolt": "Galeclaw",
    "Foxcicle": "Beegarde",
    "Pyrin": "Celaray",
    "Pyrin Noct": "Dinossom",
    "Reindrix": "Rushoar",
    "Rayhound": "Direhowl",
    "Kitsun": "Lunaris",
    "Dazzi": "Killamari",
    "Lunaris": "Tanzee",
    "Dinossom": "Lunaris",
    "Dinossom Lux": "Gobfin",
    "Surfent": "Fenglope",
    "Surfent Terra": "Loupmoon",
    "Maraith": "Kelpsea",
    "Digtoise": "Lunaris",
    "Tombat": "Direhowl",
    "Lovander": "Wixen",
    "Flambelle": "Hoocrates",
    "Vanwyrm": "Robinquill",
    "Vanwyrm Cryst": "Felbat",
    "Bushi": "Felbat",
    "Beakon": "Chillet",
    "Ragnahawk": "Reindrix",
    "Katress": "Gorirat",
    "Wixen": "Kelpsea Ignis",
    "Verdash": "Woolipop",
    "Vaelet": "Dazzi",
    "Sibelyx": "Eikthyrdeer",
    "Elphidran": "Loupmoon",
    "Elphidran Aqua": "Loupmoon",
    "Kelpsea": "Bristla",
    "Kelpsea Ignis": "Bristla",
    "Azurobe": "Lovander",
    "Cryolinx": "Tombat",
    "Blazehowl": "Gorirat",
    "Blazehowl Noct": "Galeclaw",
    "Relaxaurus": "Kitsun",
    "Relaxaurus Lux": "Kitsun",
    "Broncherry": "Leezpunk",
    "Broncherry Aqua": "Lunaris",
    "Petallia": "Cawgnito",
    "Reptyro": "Digtoise",
    "Ice Reptyro": "Chillet",
    "Kingpaca": "Eikthyrdeer",
    "Ice Kingpaca": "Mozzarina",
    "Mammorest": "Digtoise",
    "Mammorest Cryst": "Kitsun",
    "Wumpo": "Eikthyrdeer",
    "Wumpo Botan": "Caprity",
    "Warsect": "Broncherry",
    "Fenglope": "Nox",
    "Felbat": "Woolipop",
    "Quivern": "Broncherry",
    "Blazamut": "Katress",
    "Helzephyr": "Arsox",
    "Astegon": "Foxcicle",
    "Menasting": "Dinossom",
    "Anubis": "Fenglope",
    "Jormuntide": "Digtoise",
    "Jormuntide Ignis": "Digtoise",
    "Suzaku": "Blazehowl",
    "Suzaku Aqua": "Blazehowl",
    "Grizzbolt": "Arsox",
    "Lyleen": "Dinossom",
    "Lyleen Noct": "Arsox",
    "Faleris": "Reindrix",
    "Orserk": "Foxcicle",
    "Shadowbeak": "Blazehowl",
    "Paladius": "Rayhound",
    "Necromus": "Rayhound",
    "Frostallion": "Tombat",
    "Frostallion Noct": "Rayhound",
    "Jetragon": "Rayhound"
  },
  "Cremis": {
    "Lamball": "Cattiva",
    "Cattiva": "Cattiva",
    "Chikipi": "Mau",
    "Lifmunk": "Vixy",
    "Foxparks": "Lifmunk",
    "Fuack": "Hoocrates",
    "Sparkit": "Lifmunk",
    "Tanzee": "Pengullet",
    "Rooby": "Swee",
    "Pengullet": "Flambelle",
    "Penking": "Verdash",
    "Jolthog": "Sparkit",
    "Jolthog Cryst": "Sparkit",
    "Gumoss": "Pengullet",
    "Gumoss (Special)": "Pengullet",
    "Vixy": "Cremis",
    "Hoocrates": "Hangyu",
    "Teafant": "Lamball",
    "Depresso": "Hangyu",
    "Cremis": "Cremis",
    "Daedream": "Tocotoco",
    "Rushoar": "Killamari",
    "Nox": "Bristla",
    "Fuddler": "Tocotoco",
    "Killamari": "Jolthog",
    "Mau": "Lamball",
    "Mau Cryst": "Vixy",
    "Celaray": "Wixen",
    "Direhowl": "Kelpsea",
    "Tocotoco": "Foxparks",
    "Flopie": "Jolthog",
    "Mozzarina": "Nox",
    "Bristla": "Hoocrates",
    "Gobfin": "Kelpsea Ignis",
    "Gobfin Ignis": "Flopie",
    "Hangyu": "Lifmunk",
    "Hangyu Cryst": "Lifmunk",
    "Mossanda": "Lovander",
    "Mossanda Lux": "Eikthyrdeer",
    "Woolipop": "Bristla",
    "Caprity": "Woolipop",
    "Melpaca": "Nox",
    "Eikthyrdeer": "Woolipop",
    "Eikthyrdeer Terra": "Nox",
    "Nitewing": "Lovander",
    "Ribunny": "Depresso",
    "Incineram": "Robinquill",
    "Incineram Noct": "Robinquill",
    "Cinnamoth": "Fenglope",
    "Arsox": "Leezpunk",
    "Dumud": "Nox",
    "Cawgnito": "Kelpsea Ignis",
    "Leezpunk": "Killamari",
    "Leezpunk Ignis": "Swee",
    "Loupmoon": "Dazzi",
    "Galeclaw": "Gumoss",
    "Robinquill": "Gumoss",
    "Robinquill Terra": "Daedream",
    "Gorirat": "Tanzee",
    "Beegarde": "Kelpsea",
    "Elizabee": "Dumud",
    "Grintale": "Fenglope",
    "Swee": "Depresso",
    "Sweepa": "Caprity",
    "Chillet": "Rushoar",
    "Univolt": "Beegarde",
    "Foxcicle": "Lunaris",
    "Pyrin": "Mozzarina",
    "Pyrin Noct": "Digtoise",
    "Reindrix": "Wixen",
    "Rayhound": "Gobfin",
    "Kitsun": "Maraith",
    "Dazzi": "Fuack",
    "Lunaris": "Flopie",
    "Dinossom": "Rushoar",
    "Dinossom Lux": "Rushoar",
    "Surfent": "Felbat",
    "Surfent Terra": "Felbat",
    "Maraith": "Swee",
    "Digtoise": "Rooby",
    "Tombat": "Lunaris",
    "Lovander": "Woolipop",
    "Flambelle": "Lifmunk",
    "Vanwyrm": "Direhowl",
    "Vanwyrm Cryst": "Gorirat",
    "Bushi": "Vaelet",
    "Beakon": "Kitsun",
    "Ragnahawk": "Eikthyrdeer",
    "Katress": "Cawgnito",
    "Wixen": "Ribunny",
    "Verdash": "Fuddler",
    "Vaelet": "Tanzee",
    "Sibelyx": "Loupmoon",
    "Elphidran": "Verdash",
    "Elphidran Aqua": "Verdash",
    "Kelpsea": "Pengullet",
    "Kelpsea Ignis": "Jolthog",
    "Azurobe": "Fenglope",
    "Cryolinx": "Arsox",
    "Blazehowl": "Cawgnito",
    "Blazehowl Noct": "Direhowl",
    "Relaxaurus": "Celaray",
    "Relaxaurus Lux": "Broncherry",
    "Broncherry": "Wixen",
    "Broncherry Aqua": "Maraith",
    "Petallia": "Leezpunk",
    "Reptyro": "Melpaca",
    "Ice Reptyro": "Digtoise",
    "Kingpaca": "Loupmoon",
    "Ice Kingpaca": "Loupmoon",
    "Mammorest": "Reindrix",
    "Mammorest Cryst": "Celaray",
    "Wumpo": "Loupmoon",
    "Wumpo Botan": "Fenglope",
    "Warsect": "Dumud",
    "Fenglope": "Fuddler",
    "Felbat": "Daedream",
    "Quivern": "Mozzarina",
    "Blazamut": "Rayhound",
    "Helzephyr": "Dinossom",
    "Astegon": "Chillet",
    "Menasting": "Broncherry",
    "Anubis": "Felbat",
    "Jormuntide": "Reindrix",
    "Jormuntide Ignis": "Melpaca",
    "Suzaku": "Tombat",
    "Suzaku Aqua": "Rayhound",
    "Grizzbolt": "Kitsun",
    "Lyleen": "Digtoise",
    "Lyleen Noct": "Kitsun",
    "Faleris": "Mozzarina",
    "Orserk": "Chillet",
    "Shadowbeak": "Foxcicle",
    "Paladius": "Foxcicle",
    "Necromus": "Foxcicle",
    "Frostallion": "Arsox",
    "Frostallion Noct": "Petallia",
    "Jetragon": "Petallia"
  },
  "Daedream": {
    "Lamball": "Pengullet",
    "Cattiva": "Tocotoco",
    "Chikipi": "Jolthog",
    "Lifmunk": "Fuack",
    "Foxparks": "Bristla",
    "Fuack": "Flopie",
    "Sparkit": "Bristla",
    "Tanzee": "Gumoss",
    "Rooby": "Woolipop",
    "Pengullet": "Killamari",
    "Penking": "Reindrix",
    "Jolthog": "Swee",
    "Jolthog Cryst": "Killamari",
    "Gumoss": "Daedream",
    "Gumoss (Special)": "Daedream",
    "Vixy": "Tocotoco",
    "Hoocrates": "Ribunny",
    "Teafant": "Jolthog",
    "Depresso": "Swee",
    "Cremis": "Tocotoco",
    "Daedream": "Daedream",
    "Rushoar": "Nox",
    "Nox": "Dazzi",
    "Fuddler": "Fuddler",
    "Killamari": "Kelpsea",
    "Mau": "Pengullet",
    "Mau Cryst": "Tocotoco",
    "Celaray": "Vaelet",
    "Direhowl": "Maraith",
    "Tocotoco": "Killamari",
    "Flopie": "Kelpsea",
    "Mozzarina": "Beegarde",
    "Bristla": "Kelpsea Ignis",
    "Gobfin": "Wixen",
    "Gobfin Ignis": "Wixen",
    "Hangyu": "Bristla",
    "Hangyu Cryst": "Fuack",
    "Mossanda": "Kitsun",
    "Mossanda Lux": "Dinossom",
    "Woolipop": "Dazzi",
    "Caprity": "Cawgnito",
    "Melpaca": "Direhowl",
    "Eikthyrdeer": "Cawgnito",
    "Eikthyrdeer Terra": "Direhowl",
    "Nitewing": "Kitsun",
    "Ribunny": "Kelpsea Ignis",
    "Incineram": "Mozzarina",
    "Incineram Noct": "Mozzarina",
    "Cinnamoth": "Broncherry",
    "Arsox": "Felbat",
    "Dumud": "Direhowl",
    "Cawgnito": "Rooby",
    "Leezpunk": "Nox",
    "Leezpunk Ignis": "Woolipop",
    "Loupmoon": "Gobfin",
    "Galeclaw": "Rushoar",
    "Robinquill": "Rushoar",
    "Robinquill Terra": "Lunaris",
    "Gorirat": "Rushoar",
    "Beegarde": "Maraith",
    "Elizabee": "Petallia",
    "Grintale": "Celaray",
    "Swee": "Kelpsea",
    "Sweepa": "Dinossom",
    "Chillet": "Robinquill",
    "Univolt": "Loupmoon",
    "Foxcicle": "Verdash",
    "Pyrin": "Arsox",
    "Pyrin Noct": "Rayhound",
    "Reindrix": "Direhowl",
    "Rayhound": "Fenglope",
    "Kitsun": "Galeclaw",
    "Dazzi": "Fuddler",
    "Lunaris": "Wixen",
    "Dinossom": "Galeclaw",
    "Dinossom Lux": "Robinquill",
    "Surfent": "Dumud",
    "Surfent Terra": "Melpaca",
    "Maraith": "Woolipop",
    "Digtoise": "Gorirat",
    "Tombat": "Verdash",
    "Lovander": "Gobfin",
    "Flambelle": "Bristla",
    "Vanwyrm": "Loupmoon",
    "Vanwyrm Cryst": "Eikthyrdeer",
    "Bushi": "Caprity",
    "Beakon": "Rayhound",
    "Ragnahawk": "Chillet",
    "Katress": "Loupmoon",
    "Wixen": "Woolipop",
    "Verdash": "Lunaris",
    "Vaelet": "Rushoar",
    "Sibelyx": "Digtoise",
    "Elphidran": "Melpaca",
    "Elphidran Aqua": "Reindrix",
    "Kelpsea": "Tanzee",
    "Kelpsea Ignis": "Tanzee",
    "Azurobe": "Broncherry",
    "Cryolinx": "Univolt",
    "Blazehowl": "Fenglope",
    "Blazehowl Noct": "Loupmoon",
    "Relaxaurus": "Tombat",
    "Relaxaurus Lux": "Tombat",
    "Broncherry": "Gorirat",
    "Broncherry Aqua": "Galeclaw",
    "Petallia": "Felbat",
    "Reptyro": "Petallia",
    "Ice Reptyro": "Rayhound",
    "Kingpaca": "Digtoise",
    "Ice Kingpaca": "Kitsun",
    "Mammorest": "Foxcicle",
    "Mammorest Cryst": "Foxcicle",
    "Wumpo": "Digtoise",
    "Wumpo Botan": "Digtoise",
    "Warsect": "Arsox",
    "Fenglope": "Lunaris",
    "Felbat": "Leezpunk",
    "Quivern": "Arsox",
    "Blazamut": "Bushi",
    "Helzephyr": "Blazehowl",
    "Astegon": "Univolt",
    "Menasting": "Tombat",
    "Anubis": "Dumud",
    "Jormuntide": "Foxcicle",
    "Jormuntide Ignis": "Petallia",
    "Suzaku": "Bushi",
    "Suzaku Aqua": "Bushi",
    "Grizzbolt": "Blazehowl",
    "Lyleen": "Rayhound",
    "Lyleen Noct": "Blazehowl",
    "Faleris": "Chillet",
    "Orserk": "Univolt",
    "Shadowbeak": "Bushi",
    "Paladius": "Vanwyrm",
    "Necromus": "Vanwyrm",
    "Frostallion": "Univolt",
    "Frostallion Noct": "Vanwyrm",
    "Jetragon": "Vanwyrm"
  },
  "Rushoar": {
    "Lamball": "Swee",
    "Cattiva": "Killamari",
    "Chikipi": "Bristla",
    "Lifmunk": "Flopie",
    "Foxparks": "Kelpsea",
    "Fuack": "Daedream",
    "Sparkit": "Kelpsea Ignis",
    "Tanzee": "Woolipop",
    "Rooby": "Maraith",
    "Pengullet": "Gumoss",
    "Penking": "Kitsun",
    "Jolthog": "Tanzee",
    "Jolthog Cryst": "Tanzee",
    "Gumoss": "Woolipop",
    "Gumoss (Special)": "Woolipop",
    "Vixy": "Killamari",
    "Hoocrates": "Kelpsea",
    "Teafant": "Ribunny",
    "Depresso": "Kelpsea",
    "Cremis": "Killamari",
    "Daedream": "Nox",
    "Rushoar": "Rushoar",
    "Nox": "Rooby",
    "Fuddler": "Nox",
    "Killamari": "Dazzi",
    "Mau": "Swee",
    "Mau Cryst": "Killamari",
    "Celaray": "Felbat",
    "Direhowl": "Gobfin",
    "Tocotoco": "Daedream",
    "Flopie": "Dazzi",
    "Mozzarina": "Robinquill",
    "Bristla": "Fuddler",
    "Gobfin": "Lunaris",
    "Gobfin Ignis": "Lunaris",
    "Hangyu": "Kelpsea Ignis",
    "Hangyu Cryst": "Flopie",
    "Mossanda": "Petallia",
    "Mossanda Lux": "Foxcicle",
    "Woolipop": "Wixen",
    "Caprity": "Galeclaw",
    "Melpaca": "Felbat",
    "Eikthyrdeer": "Galeclaw",
    "Eikthyrdeer Terra": "Robinquill",
    "Nitewing": "Petallia",
    "Ribunny": "Fuddler",
    "Incineram": "Broncherry",
    "Incineram Noct": "Digtoise",
    "Cinnamoth": "Dinossom",
    "Arsox": "Loupmoon",
    "Dumud": "Felbat",
    "Cawgnito": "Lunaris",
    "Leezpunk": "Rushoar",
    "Leezpunk Ignis": "Rushoar",
    "Loupmoon": "Gorirat",
    "Galeclaw": "Cawgnito",
    "Robinquill": "Cawgnito",
    "Robinquill Terra": "Direhowl",
    "Gorirat": "Gobfin",
    "Beegarde": "Lunaris",
    "Elizabee": "Rayhound",
    "Grintale": "Dinossom",
    "Swee": "Dazzi",
    "Sweepa": "Foxcicle",
    "Chillet": "Loupmoon",
    "Univolt": "Mozzarina",
    "Foxcicle": "Loupmoon",
    "Pyrin": "Tombat",
    "Pyrin Noct": "Univolt",
    "Reindrix": "Felbat",
    "Rayhound": "Caprity",
    "Kitsun": "Fenglope",
    "Dazzi": "Wixen",
    "Lunaris": "Leezpunk",
    "Dinossom": "Fenglope",
    "Dinossom Lux": "Fenglope",
    "Surfent": "Digtoise",
    "Surfent Terra": "Digtoise",
    "Maraith": "Rushoar",
    "Digtoise": "Verdash",
    "Tombat": "Lovander",
    "Lovander": "Galeclaw",
    "Flambelle": "Kelpsea Ignis",
    "Vanwyrm": "Dumud",
    "Vanwyrm Cryst": "Reindrix",
    "Bushi": "Melpaca",
    "Beakon": "Univolt",
    "Ragnahawk": "Tombat",
    "Katress": "Eikthyrdeer",
    "Wixen": "Maraith",
    "Verdash": "Direhowl",
    "Vaelet": "Gobfin",
    "Sibelyx": "Arsox",
    "Elphidran": "Kitsun",
    "Elphidran Aqua": "Kitsun",
    "Kelpsea": "Woolipop",
    "Kelpsea Ignis": "Dazzi",
    "Azurobe": "Dinossom",
    "Cryolinx": "Bushi",
    "Blazehowl": "Eikthyrdeer",
    "Blazehowl Noct": "Dumud",
    "Relaxaurus": "Blazehowl",
    "Relaxaurus Lux": "Katress",
    "Broncherry": "Verdash",
    "Broncherry Aqua": "Fenglope",
    "Petallia": "Loupmoon",
    "Reptyro": "Rayhound",
    "Ice Reptyro": "Univolt",
    "Kingpaca": "Chillet",
    "Ice Kingpaca": "Arsox",
    "Mammorest": "Blazehowl",
    "Mammorest Cryst": "Blazehowl",
    "Wumpo": "Arsox",
    "Wumpo Botan": "Chillet",
    "Warsect": "Rayhound",
    "Fenglope": "Direhowl",
    "Felbat": "Beegarde",
    "Quivern": "Rayhound",
    "Blazamut": "Anubis",
    "Helzephyr": "Vanwyrm",
    "Astegon": "Bushi",
    "Menasting": "Katress",
    "Anubis": "Digtoise",
    "Jormuntide": "Blazehowl",
    "Jormuntide Ignis": "Blazehowl",
    "Suzaku": "Incineram",
    "Suzaku Aqua": "Anubis",
    "Grizzbolt": "Vanwyrm",
    "Lyleen": "Univolt",
    "Lyleen Noct": "Univolt",
    "Faleris": "Tombat",
    "Orserk": "Bushi",
    "Shadowbeak": "Incineram",
    "Paladius": "Incineram",
    "Necromus": "Incineram",
    "Frostallion": "Bushi",
    "Frostallion Noct": "Incineram",
    "Jetragon": "Incineram"
  },
  "Nox": {
    "Lamball": "Bristla",
    "Cattiva": "Bristla",
    "Chikipi": "Tocotoco",
    "Lifmunk": "Swee",
    "Foxparks": "Killamari",
    "Fuack": "Kelpsea",
    "Sparkit": "Killamari",
    "Tanzee": "Dazzi",
    "Rooby": "Wixen",
    "Pengullet": "Kelpsea",
    "Penking": "Digtoise",
    "Jolthog": "Kelpsea Ignis",
    "Jolthog Cryst": "Kelpsea Ignis",
    "Gumoss": "Dazzi",
    "Gumoss (Special)": "Dazzi",
    "Vixy": "Bristla",
    "Hoocrates": "Killamari",
    "Teafant": "Tocotoco",
    "Depresso": "Flopie",
    "Cremis": "Bristla",
    "Daedream": "Dazzi",
    "Rushoar": "Rooby",
    "Nox": "Nox",
    "Fuddler": "Dazzi",
    "Killamari": "Daedream",
    "Mau": "Fuack",
    "Mau Cryst": "Ribunny",
    "Celaray": "Galeclaw",
    "Direhowl": "Leezpunk",
    "Tocotoco": "Kelpsea",
    "Flopie": "Daedream",
    "Mozzarina": "Gorirat",
    "Bristla": "Tanzee",
    "Gobfin": "Rushoar",
    "Gobfin Ignis": "Rushoar",
    "Hangyu": "Swee",
    "Hangyu Cryst": "Swee",
    "Mossanda": "Chillet",
    "Mossanda Lux": "Arsox",
    "Woolipop": "Woolipop",
    "Caprity": "Direhowl",
    "Melpaca": "Galeclaw",
    "Eikthyrdeer": "Vaelet",
    "Eikthyrdeer Terra": "Gorirat",
    "Nitewing": "Chillet",
    "Ribunny": "Tanzee",
    "Incineram": "Melpaca",
    "Incineram Noct": "Reindrix",
    "Cinnamoth": "Kitsun",
    "Arsox": "Fenglope",
    "Dumud": "Gorirat",
    "Cawgnito": "Rushoar",
    "Leezpunk": "Maraith",
    "Leezpunk Ignis": "Wixen",
    "Loupmoon": "Direhowl",
    "Galeclaw": "Lunaris",
    "Robinquill": "Lunaris",
    "Robinquill Terra": "Gobfin",
    "Gorirat": "Lunaris",
    "Beegarde": "Rushoar",
    "Elizabee": "Tombat",
    "Grintale": "Digtoise",
    "Swee": "Gumoss",
    "Sweepa": "Arsox",
    "Chillet": "Verdash",
    "Univolt": "Caprity",
    "Foxcicle": "Fenglope",
    "Pyrin": "Foxcicle",
    "Pyrin Noct": "Blazehowl",
    "Reindrix": "Galeclaw",
    "Rayhound": "Loupmoon",
    "Kitsun": "Felbat",
    "Dazzi": "Woolipop",
    "Lunaris": "Maraith",
    "Dinossom": "Felbat",
    "Dinossom Lux": "Verdash",
    "Surfent": "Celaray",
    "Surfent Terra": "Broncherry",
    "Maraith": "Wixen",
    "Digtoise": "Robinquill",
    "Tombat": "Loupmoon",
    "Lovander": "Direhowl",
    "Flambelle": "Killamari",
    "Vanwyrm": "Eikthyrdeer",
    "Vanwyrm Cryst": "Dumud",
    "Bushi": "Mozzarina",
    "Beakon": "Katress",
    "Ragnahawk": "Petallia",
    "Katress": "Lovander",
    "Wixen": "Wixen",
    "Verdash": "Gobfin",
    "Vaelet": "Lunaris",
    "Sibelyx": "Dinossom",
    "Elphidran": "Broncherry",
    "Elphidran Aqua": "Digtoise",
    "Kelpsea": "Fuddler",
    "Kelpsea Ignis": "Fuddler",
    "Azurobe": "Digtoise",
    "Cryolinx": "Vanwyrm",
    "Blazehowl": "Loupmoon",
    "Blazehowl Noct": "Eikthyrdeer",
    "Relaxaurus": "Rayhound",
    "Relaxaurus Lux": "Rayhound",
    "Broncherry": "Robinquill",
    "Broncherry Aqua": "Felbat",
    "Petallia": "Fenglope",
    "Reptyro": "Tombat",
    "Ice Reptyro": "Blazehowl",
    "Kingpaca": "Kitsun",
    "Ice Kingpaca": "Dinossom",
    "Mammorest": "Rayhound",
    "Mammorest Cryst": "Rayhound",
    "Wumpo": "Dinossom",
    "Wumpo Botan": "Kitsun",
    "Warsect": "Foxcicle",
    "Fenglope": "Cawgnito",
    "Felbat": "Gobfin",
    "Quivern": "Foxcicle",
    "Blazamut": "Incineram",
    "Helzephyr": "Univolt",
    "Astegon": "Vanwyrm",
    "Menasting": "Blazehowl",
    "Anubis": "Reindrix",
    "Jormuntide": "Tombat",
    "Jormuntide Ignis": "Tombat",
    "Suzaku": "Incineram",
    "Suzaku Aqua": "Incineram",
    "Grizzbolt": "Univolt",
    "Lyleen": "Blazehowl",
    "Lyleen Noct": "Katress",
    "Faleris": "Petallia",
    "Orserk": "Vanwyrm",
    "Shadowbeak": "Bushi",
    "Paladius": "Bushi",
    "Necromus": "Bushi",
    "Frostallion": "Vanwyrm",
    "Frostallion Noct": "Bushi",
    "Jetragon": "Bushi"
  },
  "Fuddler": {
    "Lamball": "Tocotoco",
    "Cattiva": "Tocotoco",
    "Chikipi": "Jolthog",
    "Lifmunk": "Bristla",
    "Foxparks": "Ribunny",
    "Fuack": "Kelpsea Ignis",
    "Sparkit": "Bristla",
    "Tanzee": "Daedream",
    "Rooby": "Woolipop",
    "Pengullet": "Killamari",
    "Penking": "Celaray",
    "Jolthog": "Killamari",
    "Jolthog Cryst": "Killamari",
    "Gumoss": "Daedream",
    "Gumoss (Special)": "Daedream",
    "Vixy": "Tocotoco",
    "Hoocrates": "Swee",
    "Teafant": "Pengullet",
    "Depresso": "Swee",
    "Cremis": "Tocotoco",
    "Daedream": "Fuddler",
    "Rushoar": "Nox",
    "Nox": "Dazzi",
    "Fuddler": "Fuddler",
    "Killamari": "Kelpsea",
    "Mau": "Pengullet",
    "Mau Cryst": "Fuack",
    "Celaray": "Gorirat",
    "Direhowl": "Rushoar",
    "Tocotoco": "Flopie",
    "Flopie": "Tanzee",
    "Mozzarina": "Direhowl",
    "Bristla": "Kelpsea Ignis",
    "Gobfin": "Rooby",
    "Gobfin Ignis": "Wixen",
    "Hangyu": "Bristla",
    "Hangyu Cryst": "Bristla",
    "Mossanda": "Kitsun",
    "Mossanda Lux": "Chillet",
    "Woolipop": "Dazzi",
    "Caprity": "Cawgnito",
    "Melpaca": "Direhowl",
    "Eikthyrdeer": "Beegarde",
    "Eikthyrdeer Terra": "Direhowl",
    "Nitewing": "Dinossom",
    "Ribunny": "Kelpsea",
    "Incineram": "Mozzarina",
    "Incineram Noct": "Dumud",
    "Cinnamoth": "Digtoise",
    "Arsox": "Felbat",
    "Dumud": "Direhowl",
    "Cawgnito": "Maraith",
    "Leezpunk": "Wixen",
    "Leezpunk Ignis": "Nox",
    "Loupmoon": "Gobfin",
    "Galeclaw": "Rushoar",
    "Robinquill": "Robinquill Terra",
    "Robinquill Terra": "Lunaris",
    "Gorirat": "Rushoar",
    "Beegarde": "Maraith",
    "Elizabee": "Petallia",
    "Grintale": "Broncherry",
    "Swee": "Kelpsea",
    "Sweepa": "Dinossom",
    "Chillet": "Felbat",
    "Univolt": "Loupmoon",
    "Foxcicle": "Verdash",
    "Pyrin": "Arsox",
    "Pyrin Noct": "Rayhound",
    "Reindrix": "Vaelet",
    "Rayhound": "Fenglope",
    "Kitsun": "Galeclaw",
    "Dazzi": "Dazzi",
    "Lunaris": "Wixen",
    "Dinossom": "Robinquill",
    "Dinossom Lux": "Robinquill",
    "Surfent": "Melpaca",
    "Surfent Terra": "Melpaca",
    "Maraith": "Woolipop",
    "Digtoise": "Galeclaw",
    "Tombat": "Fenglope",
    "Lovander": "Cawgnito",
    "Flambelle": "Ribunny",
    "Vanwyrm": "Lovander",
    "Vanwyrm Cryst": "Eikthyrdeer",
    "Bushi": "Caprity",
    "Beakon": "Blazehowl",
    "Ragnahawk": "Chillet",
    "Katress": "Loupmoon",
    "Wixen": "Woolipop",
    "Verdash": "Lunaris",
    "Vaelet": "Rushoar",
    "Sibelyx": "Kitsun",
    "Elphidran": "Reindrix",
    "Elphidran Aqua": "Reindrix",
    "Kelpsea": "Gumoss",
    "Kelpsea Ignis": "Tanzee",
    "Azurobe": "Broncherry",
    "Cryolinx": "Univolt",
    "Blazehowl": "Loupmoon",
    "Blazehowl Noct": "Loupmoon",
    "Relaxaurus": "Tombat",
    "Relaxaurus Lux": "Tombat",
    "Broncherry": "Gorirat",
    "Broncherry Aqua": "Galeclaw",
    "Petallia": "Felbat",
    "Reptyro": "Foxcicle",
    "Ice Reptyro": "Rayhound",
    "Kingpaca": "Digtoise",
    "Ice Kingpaca": "Kitsun",
    "Mammorest": "Foxcicle",
    "Mammorest Cryst": "Tombat",
    "Wumpo": "Digtoise",
    "Wumpo Botan": "Digtoise",
    "Warsect": "Petallia",
    "Fenglope": "Lunaris",
    "Felbat": "Lunaris",
    "Quivern": "Arsox",
    "Blazamut": "Incineram",
    "Helzephyr": "Blazehowl",
    "Astegon": "Univolt",
    "Menasting": "Rayhound",
    "Anubis": "Dumud",
    "Jormuntide": "Foxcicle",
    "Jormuntide Ignis": "Foxcicle",
    "Suzaku": "Bushi",
    "Suzaku Aqua": "Bushi",
    "Grizzbolt": "Blazehowl",
    "Lyleen": "Rayhound",
    "Lyleen Noct": "Blazehowl",
    "Faleris": "Arsox",
    "Orserk": "Univolt",
    "Shadowbeak": "Bushi",
    "Paladius": "Vanwyrm",
    "Necromus": "Bushi",
    "Frostallion": "Univolt",
    "Frostallion Noct": "Vanwyrm",
    "Jetragon": "Vanwyrm"
  },
  "Killamari": {
    "Lamball": "Depresso",
    "Cattiva": "Jolthog",
    "Chikipi": "Foxparks",
    "Lifmunk": "Jolthog",
    "Foxparks": "Tocotoco",
    "Fuack": "Ribunny",
    "Sparkit": "Pengullet",
    "Tanzee": "Kelpsea Ignis",
    "Rooby": "Fuddler",
    "Pengullet": "Bristla",
    "Penking": "Mozzarina",
    "Jolthog": "Fuack",
    "Jolthog Cryst": "Bristla",
    "Gumoss": "Kelpsea",
    "Gumoss (Special)": "Kelpsea",
    "Vixy": "Jolthog",
    "Hoocrates": "Tocotoco",
    "Teafant": "Hoocrates",
    "Depresso": "Tocotoco",
    "Cremis": "Jolthog",
    "Daedream": "Kelpsea",
    "Rushoar": "Dazzi",
    "Nox": "Daedream",
    "Fuddler": "Kelpsea",
    "Killamari": "Killamari",
    "Mau": "Depresso",
    "Mau Cryst": "Jolthog",
    "Celaray": "Cawgnito",
    "Direhowl": "Nox",
    "Tocotoco": "Bristla",
    "Flopie": "Killamari",
    "Mozzarina": "Lunaris",
    "Bristla": "Swee",
    "Gobfin": "Woolipop",
    "Gobfin Ignis": "Woolipop",
    "Hangyu": "Pengullet",
    "Hangyu Cryst": "Pengullet",
    "Mossanda": "Broncherry",
    "Mossanda Lux": "Digtoise",
    "Woolipop": "Gumoss",
    "Caprity": "Lunaris",
    "Melpaca": "Gobfin",
    "Eikthyrdeer": "Lunaris",
    "Eikthyrdeer Terra": "Gobfin",
    "Nitewing": "Digtoise",
    "Ribunny": "Swee",
    "Incineram": "Lovander",
    "Incineram Noct": "Caprity",
    "Cinnamoth": "Melpaca",
    "Arsox": "Gorirat",
    "Dumud": "Gobfin",
    "Cawgnito": "Woolipop",
    "Leezpunk": "Dazzi",
    "Leezpunk Ignis": "Dazzi",
    "Loupmoon": "Leezpunk",
    "Galeclaw": "Wixen",
    "Robinquill": "Rooby",
    "Robinquill Terra": "Maraith",
    "Gorirat": "Wixen",
    "Beegarde": "Nox",
    "Elizabee": "Dinossom",
    "Grintale": "Dumud",
    "Swee": "Killamari",
    "Sweepa": "Digtoise",
    "Chillet": "Gorirat",
    "Univolt": "Fenglope",
    "Foxcicle": "Galeclaw",
    "Pyrin": "Kitsun",
    "Pyrin Noct": "Foxcicle",
    "Reindrix": "Gobfin",
    "Rayhound": "Robinquill",
    "Kitsun": "Direhowl",
    "Dazzi": "Tanzee",
    "Lunaris": "Dazzi",
    "Dinossom": "Direhowl",
    "Dinossom Lux": "Vaelet",
    "Surfent": "Eikthyrdeer",
    "Surfent Terra": "Eikthyrdeer",
    "Maraith": "Fuddler",
    "Digtoise": "Beegarde",
    "Tombat": "Robinquill",
    "Lovander": "Lunaris",
    "Flambelle": "Pengullet",
    "Vanwyrm": "Fenglope",
    "Vanwyrm Cryst": "Loupmoon",
    "Bushi": "Loupmoon",
    "Beakon": "Tombat",
    "Ragnahawk": "Kitsun",
    "Katress": "Verdash",
    "Wixen": "Fuddler",
    "Verdash": "Rushoar",
    "Vaelet": "Wixen",
    "Sibelyx": "Celaray",
    "Elphidran": "Eikthyrdeer",
    "Elphidran Aqua": "Mozzarina",
    "Kelpsea": "Kelpsea Ignis",
    "Kelpsea Ignis": "Flopie",
    "Azurobe": "Dumud",
    "Cryolinx": "Blazehowl",
    "Blazehowl": "Felbat",
    "Blazehowl Noct": "Fenglope",
    "Relaxaurus": "Arsox",
    "Relaxaurus Lux": "Petallia",
    "Broncherry": "Cawgnito",
    "Broncherry Aqua": "Direhowl",
    "Petallia": "Galeclaw",
    "Reptyro": "Chillet",
    "Ice Reptyro": "Foxcicle",
    "Kingpaca": "Reindrix",
    "Ice Kingpaca": "Broncherry",
    "Mammorest": "Arsox",
    "Mammorest Cryst": "Arsox",
    "Wumpo": "Reindrix",
    "Wumpo Botan": "Melpaca",
    "Warsect": "Dinossom",
    "Fenglope": "Rushoar",
    "Felbat": "Maraith",
    "Quivern": "Dinossom",
    "Blazamut": "Vanwyrm",
    "Helzephyr": "Rayhound",
    "Astegon": "Blazehowl",
    "Menasting": "Petallia",
    "Anubis": "Caprity",
    "Jormuntide": "Chillet",
    "Jormuntide Ignis": "Chillet",
    "Suzaku": "Univolt",
    "Suzaku Aqua": "Vanwyrm",
    "Grizzbolt": "Tombat",
    "Lyleen": "Foxcicle",
    "Lyleen Noct": "Tombat",
    "Faleris": "Kitsun",
    "Orserk": "Blazehowl",
    "Shadowbeak": "Univolt",
    "Paladius": "Univolt",
    "Necromus": "Univolt",
    "Frostallion": "Blazehowl",
    "Frostallion Noct": "Katress",
    "Jetragon": "Univolt"
  },
  "Mau": {
    "Lamball": "Mau",
    "Cattiva": "Lamball",
    "Chikipi": "Teafant",
    "Lifmunk": "Cremis",
    "Foxparks": "Lifmunk",
    "Fuack": "Flambelle",
    "Sparkit": "Vixy",
    "Tanzee": "Jolthog",
    "Rooby": "Bristla",
    "Pengullet": "Mau Cryst",
    "Penking": "Felbat",
    "Jolthog": "Lifmunk",
    "Jolthog Cryst": "Hangyu",
    "Gumoss": "Jolthog",
    "Gumoss (Special)": "Jolthog",
    "Vixy": "Lamball",
    "Hoocrates": "Lifmunk",
    "Teafant": "Mau",
    "Depresso": "Lifmunk",
    "Cremis": "Lamball",
    "Daedream": "Pengullet",
    "Rushoar": "Swee",
    "Nox": "Fuack",
    "Fuddler": "Pengullet",
    "Killamari": "Depresso",
    "Mau": "Mau",
    "Mau Cryst": "Cattiva",
    "Celaray": "Nox",
    "Direhowl": "Kelpsea Ignis",
    "Tocotoco": "Sparkit",
    "Flopie": "Depresso",
    "Mozzarina": "Woolipop",
    "Bristla": "Foxparks",
    "Gobfin": "Killamari",
    "Gobfin Ignis": "Killamari",
    "Hangyu": "Vixy",
    "Hangyu Cryst": "Vixy",
    "Mossanda": "Loupmoon",
    "Mossanda Lux": "Caprity",
    "Woolipop": "Tocotoco",
    "Caprity": "Dazzi",
    "Melpaca": "Woolipop",
    "Eikthyrdeer": "Dazzi",
    "Eikthyrdeer Terra": "Woolipop",
    "Nitewing": "Loupmoon",
    "Ribunny": "Foxparks",
    "Incineram": "Galeclaw",
    "Incineram Noct": "Galeclaw",
    "Cinnamoth": "Fenglope",
    "Arsox": "Rushoar",
    "Dumud": "Woolipop",
    "Cawgnito": "Flopie",
    "Leezpunk": "Swee",
    "Leezpunk Ignis": "Ribunny",
    "Loupmoon": "Dazzi",
    "Galeclaw": "Kelpsea",
    "Robinquill": "Tanzee",
    "Robinquill Terra": "Gumoss",
    "Gorirat": "Kelpsea",
    "Beegarde": "Kelpsea Ignis",
    "Elizabee": "Mozzarina",
    "Grintale": "Verdash",
    "Swee": "Hoocrates",
    "Sweepa": "Loupmoon",
    "Chillet": "Rushoar",
    "Univolt": "Cawgnito",
    "Foxcicle": "Leezpunk",
    "Pyrin": "Eikthyrdeer",
    "Pyrin Noct": "Broncherry",
    "Reindrix": "Nox",
    "Rayhound": "Lunaris",
    "Kitsun": "Rooby",
    "Dazzi": "Tocotoco",
    "Lunaris": "Killamari",
    "Dinossom": "Maraith",
    "Dinossom Lux": "Maraith",
    "Surfent": "Robinquill",
    "Surfent Terra": "Robinquill",
    "Maraith": "Bristla",
    "Digtoise": "Wixen",
    "Tombat": "Lunaris",
    "Lovander": "Dazzi",
    "Flambelle": "Vixy",
    "Vanwyrm": "Beegarde",
    "Vanwyrm Cryst": "Vaelet",
    "Bushi": "Direhowl",
    "Beakon": "Digtoise",
    "Ragnahawk": "Caprity",
    "Katress": "Gobfin",
    "Wixen": "Bristla",
    "Verdash": "Daedream",
    "Vaelet": "Kelpsea",
    "Sibelyx": "Loupmoon",
    "Elphidran": "Felbat",
    "Elphidran Aqua": "Felbat",
    "Kelpsea": "Jolthog",
    "Kelpsea Ignis": "Jolthog",
    "Azurobe": "Verdash",
    "Cryolinx": "Chillet",
    "Blazehowl": "Gobfin",
    "Blazehowl Noct": "Cawgnito",
    "Relaxaurus": "Reindrix",
    "Relaxaurus Lux": "Reindrix",
    "Broncherry": "Wixen",
    "Broncherry Aqua": "Wixen",
    "Petallia": "Rushoar",
    "Reptyro": "Dumud",
    "Ice Reptyro": "Digtoise",
    "Kingpaca": "Fenglope",
    "Ice Kingpaca": "Loupmoon",
    "Mammorest": "Melpaca",
    "Mammorest Cryst": "Melpaca",
    "Wumpo": "Fenglope",
    "Wumpo Botan": "Fenglope",
    "Warsect": "Mozzarina",
    "Fenglope": "Daedream",
    "Felbat": "Tanzee",
    "Quivern": "Eikthyrdeer",
    "Blazamut": "Tombat",
    "Helzephyr": "Kitsun",
    "Astegon": "Dinossom",
    "Menasting": "Celaray",
    "Anubis": "Galeclaw",
    "Jormuntide": "Dumud",
    "Jormuntide Ignis": "Dumud",
    "Suzaku": "Foxcicle",
    "Suzaku Aqua": "Tombat",
    "Grizzbolt": "Digtoise",
    "Lyleen": "Broncherry",
    "Lyleen Noct": "Digtoise",
    "Faleris": "Eikthyrdeer",
    "Orserk": "Dinossom",
    "Shadowbeak": "Foxcicle",
    "Paladius": "Petallia",
    "Necromus": "Petallia",
    "Frostallion": "Chillet",
    "Frostallion Noct": "Arsox",
    "Jetragon": "Arsox"
  },
  "Mau Cryst": {
    "variant": true,
    "Lamball": "Cremis",
    "Cattiva": "Vixy",
    "Chikipi": "Lamball",
    "Lifmunk": "Lifmunk",
    "Foxparks": "Hangyu",
    "Fuack": "Depresso",
    "Sparkit": "Lifmunk",
    "Tanzee": "Tocotoco",
    "Rooby": "Swee",
    "Pengullet": "Foxparks",
    "Penking": "Fenglope",
    "Jolthog": "Flambelle",
    "Jolthog Cryst": "Foxparks",
    "Gumoss": "Tocotoco",
    "Gumoss (Special)": "Tocotoco",
    "Vixy": "Vixy",
    "Hoocrates": "Hangyu",
    "Teafant": "Lamball",
    "Depresso": "Sparkit",
    "Cremis": "Vixy",
    "Daedream": "Tocotoco",
    "Rushoar": "Killamari",
    "Nox": "Ribunny",
    "Fuddler": "Fuack",
    "Killamari": "Jolthog",
    "Mau": "Cattiva",
    "Mau Cryst": "Mau Cryst",
    "Celaray": "Rooby",
    "Direhowl": "Tanzee",
    "Tocotoco": "Hoocrates",
    "Flopie": "Jolthog",
    "Mozzarina": "Nox",
    "Bristla": "Depresso",
    "Gobfin": "Kelpsea",
    "Gobfin Ignis": "Kelpsea Ignis",
    "Hangyu": "Lifmunk",
    "Hangyu Cryst": "Lifmunk",
    "Mossanda": "Caprity",
    "Mossanda Lux": "Eikthyrdeer",
    "Woolipop": "Bristla",
    "Caprity": "Woolipop",
    "Melpaca": "Wixen",
    "Eikthyrdeer": "Nox",
    "Eikthyrdeer Terra": "Wixen",
    "Nitewing": "Caprity",
    "Ribunny": "Jolthog",
    "Incineram": "Robinquill",
    "Incineram Noct": "Felbat",
    "Cinnamoth": "Loupmoon",
    "Arsox": "Lunaris",
    "Dumud": "Wixen",
    "Cawgnito": "Kelpsea",
    "Leezpunk": "Flopie",
    "Leezpunk Ignis": "Killamari",
    "Loupmoon": "Woolipop",
    "Galeclaw": "Daedream",
    "Robinquill": "Daedream",
    "Robinquill Terra": "Fuddler",
    "Gorirat": "Gumoss",
    "Beegarde": "Kelpsea",
    "Elizabee": "Melpaca",
    "Grintale": "Fenglope",
    "Swee": "Jolthog",
    "Sweepa": "Eikthyrdeer",
    "Chillet": "Leezpunk",
    "Univolt": "Direhowl",
    "Foxcicle": "Lunaris",
    "Pyrin": "Dumud",
    "Pyrin Noct": "Digtoise",
    "Reindrix": "Wixen",
    "Rayhound": "Gobfin",
    "Kitsun": "Rushoar",
    "Dazzi": "Bristla",
    "Lunaris": "Kelpsea Ignis",
    "Dinossom": "Rushoar",
    "Dinossom Lux": "Rushoar",
    "Surfent": "Felbat",
    "Surfent Terra": "Verdash",
    "Maraith": "Killamari",
    "Digtoise": "Maraith",
    "Tombat": "Gobfin",
    "Lovander": "Woolipop",
    "Flambelle": "Hangyu",
    "Vanwyrm": "Vaelet",
    "Vanwyrm Cryst": "Galeclaw",
    "Bushi": "Gorirat",
    "Beakon": "Kitsun",
    "Ragnahawk": "Mozzarina",
    "Katress": "Beegarde",
    "Wixen": "Swee",
    "Verdash": "Dazzi",
    "Vaelet": "Tanzee",
    "Sibelyx": "Loupmoon",
    "Elphidran": "Verdash",
    "Elphidran Aqua": "Fenglope",
    "Kelpsea": "Pengullet",
    "Kelpsea Ignis": "Pengullet",
    "Azurobe": "Fenglope",
    "Cryolinx": "Arsox",
    "Blazehowl": "Cawgnito",
    "Blazehowl Noct": "Direhowl",
    "Relaxaurus": "Broncherry",
    "Relaxaurus Lux": "Digtoise",
    "Broncherry": "Maraith",
    "Broncherry Aqua": "Rushoar",
    "Petallia": "Lunaris",
    "Reptyro": "Reindrix",
    "Ice Reptyro": "Kitsun",
    "Kingpaca": "Loupmoon",
    "Ice Kingpaca": "Lovander",
    "Mammorest": "Celaray",
    "Mammorest Cryst": "Broncherry",
    "Wumpo": "Loupmoon",
    "Wumpo Botan": "Loupmoon",
    "Warsect": "Melpaca",
    "Fenglope": "Dazzi",
    "Felbat": "Fuddler",
    "Quivern": "Dumud",
    "Blazamut": "Rayhound",
    "Helzephyr": "Dinossom",
    "Astegon": "Arsox",
    "Menasting": "Digtoise",
    "Anubis": "Felbat",
    "Jormuntide": "Reindrix",
    "Jormuntide Ignis": "Reindrix",
    "Suzaku": "Tombat",
    "Suzaku Aqua": "Rayhound",
    "Grizzbolt": "Dinossom",
    "Lyleen": "Digtoise",
    "Lyleen Noct": "Kitsun",
    "Faleris": "Mozzarina",
    "Orserk": "Arsox",
    "Shadowbeak": "Tombat",
    "Paladius": "Foxcicle",
    "Necromus": "Tombat",
    "Frostallion": "Petallia",
    "Frostallion Noct": "Foxcicle",
    "Jetragon": "Foxcicle"
  },
  "Celaray": {
    "Lamball": "Wixen",
    "Cattiva": "Wixen",
    "Chikipi": "Woolipop",
    "Lifmunk": "Maraith",
    "Foxparks": "Rushoar",
    "Fuack": "Lunaris",
    "Sparkit": "Rushoar",
    "Tanzee": "Direhowl",
    "Rooby": "Felbat",
    "Pengullet": "Lunaris",
    "Penking": "Katress",
    "Jolthog": "Leezpunk",
    "Jolthog Cryst": "Lunaris",
    "Gumoss": "Direhowl",
    "Gumoss (Special)": "Direhowl",
    "Vixy": "Wixen",
    "Hoocrates": "Rushoar",
    "Teafant": "Nox",
    "Depresso": "Rushoar",
    "Cremis": "Wixen",
    "Daedream": "Vaelet",
    "Rushoar": "Felbat",
    "Nox": "Galeclaw",
    "Fuddler": "Gorirat",
    "Killamari": "Cawgnito",
    "Mau": "Nox",
    "Mau Cryst": "Rooby",
    "Celaray": "Celaray",
    "Direhowl": "Loupmoon",
    "Tocotoco": "Lunaris",
    "Flopie": "Cawgnito",
    "Mozzarina": "Melpaca",
    "Bristla": "Gobfin",
    "Gobfin": "Fenglope",
    "Gobfin Ignis": "Fenglope",
    "Hangyu": "Maraith",
    "Hangyu Cryst": "Maraith",
    "Mossanda": "Vanwyrm",
    "Mossanda Lux": "Bushi",
    "Woolipop": "Galeclaw",
    "Caprity": "Dumud",
    "Melpaca": "Reindrix",
    "Eikthyrdeer": "Dumud",
    "Eikthyrdeer Terra": "Melpaca",
    "Nitewing": "Bushi",
    "Ribunny": "Gobfin",
    "Incineram": "Rayhound",
    "Incineram Noct": "Rayhound",
    "Cinnamoth": "Univolt",
    "Arsox": "Kitsun",
    "Dumud": "Reindrix",
    "Cawgnito": "Fenglope",
    "Leezpunk": "Verdash",
    "Leezpunk Ignis": "Felbat",
    "Loupmoon": "Mozzarina",
    "Galeclaw": "Loupmoon",
    "Robinquill": "Loupmoon",
    "Robinquill Terra": "Caprity",
    "Gorirat": "Loupmoon",
    "Beegarde": "Fenglope",
    "Elizabee": "Incineram",
    "Grintale": "Univolt",
    "Swee": "Gobfin",
    "Sweepa": "Bushi",
    "Chillet": "Kitsun",
    "Univolt": "Petallia",
    "Foxcicle": "Dinossom",
    "Pyrin": "Incineram",
    "Pyrin Noct": "Surfent",
    "Reindrix": "Reindrix",
    "Rayhound": "Chillet",
    "Kitsun": "Digtoise",
    "Dazzi": "Gorirat",
    "Lunaris": "Verdash",
    "Dinossom": "Digtoise",
    "Dinossom Lux": "Digtoise",
    "Surfent": "Blazehowl",
    "Surfent Terra": "Blazehowl",
    "Maraith": "Felbat",
    "Digtoise": "Broncherry",
    "Tombat": "Dinossom",
    "Lovander": "Mozzarina",
    "Flambelle": "Rushoar",
    "Vanwyrm": "Foxcicle",
    "Vanwyrm Cryst": "Tombat",
    "Bushi": "Tombat",
    "Beakon": "Elphidran",
    "Ragnahawk": "Bushi",
    "Katress": "Arsox",
    "Wixen": "Robinquill",
    "Verdash": "Caprity",
    "Vaelet": "Loupmoon",
    "Sibelyx": "Vanwyrm",
    "Elphidran": "Blazehowl",
    "Elphidran Aqua": "Katress",
    "Kelpsea": "Direhowl",
    "Kelpsea Ignis": "Beegarde",
    "Azurobe": "Univolt",
    "Cryolinx": "Azurobe",
    "Blazehowl": "Arsox",
    "Blazehowl Noct": "Foxcicle",
    "Relaxaurus": "Anubis",
    "Relaxaurus Lux": "Anubis",
    "Broncherry": "Broncherry",
    "Broncherry Aqua": "Digtoise",
    "Petallia": "Kitsun",
    "Reptyro": "Incineram",
    "Ice Reptyro": "Elphidran",
    "Kingpaca": "Univolt",
    "Ice Kingpaca": "Vanwyrm",
    "Mammorest": "Incineram",
    "Mammorest Cryst": "Anubis",
    "Wumpo": "Vanwyrm",
    "Wumpo Botan": "Univolt",
    "Warsect": "Incineram",
    "Fenglope": "Eikthyrdeer",
    "Felbat": "Lovander",
    "Quivern": "Incineram",
    "Blazamut": "Sibelyx",
    "Helzephyr": "Elphidran",
    "Astegon": "Grintale",
    "Menasting": "Anubis",
    "Anubis": "Blazehowl",
    "Jormuntide": "Incineram",
    "Jormuntide Ignis": "Incineram",
    "Suzaku": "Wumpo",
    "Suzaku Aqua": "Sibelyx",
    "Grizzbolt": "Elphidran",
    "Lyleen": "Surfent",
    "Lyleen Noct": "Elphidran",
    "Faleris": "Bushi",
    "Orserk": "Azurobe",
    "Shadowbeak": "Wumpo",
    "Paladius": "Wumpo Botan",
    "Necromus": "Kingpaca",
    "Frostallion": "Azurobe",
    "Frostallion Noct": "Wumpo Botan",
    "Jetragon": "Wumpo Botan"
  },
  "Direhowl": {
    "Lamball": "Kelpsea",
    "Cattiva": "Kelpsea",
    "Chikipi": "Flopie",
    "Lifmunk": "Tanzee",
    "Foxparks": "Daedream",
    "Fuack": "Woolipop",
    "Sparkit": "Daedream",
    "Tanzee": "Rooby",
    "Rooby": "Lunaris",
    "Pengullet": "Dazzi",
    "Penking": "Arsox",
    "Jolthog": "Dazzi",
    "Jolthog Cryst": "Dazzi",
    "Gumoss": "Maraith",
    "Gumoss (Special)": "Maraith",
    "Vixy": "Kelpsea",
    "Hoocrates": "Fuddler",
    "Teafant": "Kelpsea Ignis",
    "Depresso": "Fuddler",
    "Cremis": "Kelpsea",
    "Daedream": "Maraith",
    "Rushoar": "Gobfin",
    "Nox": "Leezpunk",
    "Fuddler": "Rushoar",
    "Killamari": "Nox",
    "Mau": "Kelpsea Ignis",
    "Mau Cryst": "Tanzee",
    "Celaray": "Loupmoon",
    "Direhowl": "Direhowl",
    "Tocotoco": "Dazzi",
    "Flopie": "Wixen",
    "Mozzarina": "Fenglope",
    "Bristla": "Woolipop",
    "Gobfin": "Cawgnito",
    "Gobfin Ignis": "Cawgnito",
    "Hangyu": "Gumoss",
    "Hangyu Cryst": "Gumoss",
    "Mossanda": "Tombat",
    "Mossanda Lux": "Rayhound",
    "Woolipop": "Rushoar",
    "Caprity": "Verdash",
    "Melpaca": "Fenglope",
    "Eikthyrdeer": "Verdash",
    "Eikthyrdeer Terra": "Fenglope",
    "Nitewing": "Rayhound",
    "Ribunny": "Woolipop",
    "Incineram": "Kitsun",
    "Incineram Noct": "Dinossom",
    "Cinnamoth": "Petallia",
    "Arsox": "Eikthyrdeer",
    "Dumud": "Fenglope",
    "Cawgnito": "Beegarde",
    "Leezpunk": "Gobfin",
    "Leezpunk Ignis": "Lunaris",
    "Loupmoon": "Felbat",
    "Galeclaw": "Gorirat",
    "Robinquill": "Gorirat",
    "Robinquill Terra": "Galeclaw",
    "Gorirat": "Vaelet",
    "Beegarde": "Direhowl",
    "Elizabee": "Katress",
    "Grintale": "Arsox",
    "Swee": "Nox",
    "Sweepa": "Rayhound",
    "Chillet": "Caprity",
    "Univolt": "Celaray",
    "Foxcicle": "Mozzarina",
    "Pyrin": "Blazehowl",
    "Pyrin Noct": "Vanwyrm",
    "Reindrix": "Fenglope",
    "Rayhound": "Dumud",
    "Kitsun": "Loupmoon",
    "Dazzi": "Rushoar",
    "Lunaris": "Gobfin",
    "Dinossom": "Lovander",
    "Dinossom Lux": "Caprity",
    "Surfent": "Dinossom",
    "Surfent Terra": "Chillet",
    "Maraith": "Lunaris",
    "Digtoise": "Loupmoon",
    "Tombat": "Mozzarina",
    "Lovander": "Felbat",
    "Flambelle": "Daedream",
    "Vanwyrm": "Broncherry",
    "Vanwyrm Cryst": "Digtoise",
    "Bushi": "Digtoise",
    "Beakon": "Bushi",
    "Ragnahawk": "Blazehowl",
    "Katress": "Reindrix",
    "Wixen": "Lunaris",
    "Verdash": "Galeclaw",
    "Vaelet": "Direhowl",
    "Sibelyx": "Tombat",
    "Elphidran": "Chillet",
    "Elphidran Aqua": "Arsox",
    "Kelpsea": "Wixen",
    "Kelpsea Ignis": "Wixen",
    "Azurobe": "Petallia",
    "Cryolinx": "Incineram",
    "Blazehowl": "Melpaca",
    "Blazehowl Noct": "Broncherry",
    "Relaxaurus": "Univolt",
    "Relaxaurus Lux": "Vanwyrm",
    "Broncherry": "Loupmoon",
    "Broncherry Aqua": "Loupmoon",
    "Petallia": "Eikthyrdeer",
    "Reptyro": "Univolt",
    "Ice Reptyro": "Bushi",
    "Kingpaca": "Foxcicle",
    "Ice Kingpaca": "Tombat",
    "Mammorest": "Univolt",
    "Mammorest Cryst": "Univolt",
    "Wumpo": "Foxcicle",
    "Wumpo Botan": "Foxcicle",
    "Warsect": "Katress",
    "Fenglope": "Robinquill",
    "Felbat": "Galeclaw",
    "Quivern": "Blazehowl",
    "Blazamut": "Elphidran",
    "Helzephyr": "Bushi",
    "Astegon": "Incineram",
    "Menasting": "Vanwyrm",
    "Anubis": "Dinossom",
    "Jormuntide": "Univolt",
    "Jormuntide Ignis": "Univolt",
    "Suzaku": "Surfent",
    "Suzaku Aqua": "Elphidran",
    "Grizzbolt": "Bushi",
    "Lyleen": "Vanwyrm",
    "Lyleen Noct": "Bushi",
    "Faleris": "Blazehowl",
    "Orserk": "Incineram",
    "Shadowbeak": "Surfent",
    "Paladius": "Anubis",
    "Necromus": "Anubis",
    "Frostallion": "Incineram",
    "Frostallion Noct": "Anubis",
    "Jetragon": "Anubis"
  },
  "Tocotoco": {
    "Lamball": "Flambelle",
    "Cattiva": "Foxparks",
    "Chikipi": "Hangyu",
    "Lifmunk": "Depresso",
    "Foxparks": "Jolthog",
    "Fuack": "Tocotoco",
    "Sparkit": "Jolthog",
    "Tanzee": "Killamari",
    "Rooby": "Tanzee",
    "Pengullet": "Tocotoco",
    "Penking": "Caprity",
    "Jolthog": "Pengullet",
    "Jolthog Cryst": "Pengullet",
    "Gumoss": "Killamari",
    "Gumoss (Special)": "Killamari",
    "Vixy": "Foxparks",
    "Hoocrates": "Jolthog",
    "Teafant": "Hangyu",
    "Depresso": "Jolthog",
    "Cremis": "Foxparks",
    "Daedream": "Killamari",
    "Rushoar": "Daedream",
    "Nox": "Kelpsea",
    "Fuddler": "Flopie",
    "Killamari": "Bristla",
    "Mau": "Sparkit",
    "Mau Cryst": "Hoocrates",
    "Celaray": "Lunaris",
    "Direhowl": "Dazzi",
    "Tocotoco": "Tocotoco",
    "Flopie": "Ribunny",
    "Mozzarina": "Rushoar",
    "Bristla": "Fuack",
    "Gobfin": "Dazzi",
    "Gobfin Ignis": "Fuddler",
    "Hangyu": "Depresso",
    "Hangyu Cryst": "Depresso",
    "Mossanda": "Melpaca",
    "Mossanda Lux": "Broncherry",
    "Woolipop": "Kelpsea",
    "Caprity": "Rushoar",
    "Melpaca": "Lunaris",
    "Eikthyrdeer": "Rushoar",
    "Eikthyrdeer Terra": "Leezpunk",
    "Nitewing": "Reindrix",
    "Ribunny": "Bristla",
    "Incineram": "Loupmoon",
    "Incineram Noct": "Loupmoon",
    "Cinnamoth": "Eikthyrdeer",
    "Arsox": "Direhowl",
    "Dumud": "Leezpunk",
    "Cawgnito": "Dazzi",
    "Leezpunk": "Daedream",
    "Leezpunk Ignis": "Gumoss",
    "Loupmoon": "Maraith",
    "Galeclaw": "Woolipop",
    "Robinquill": "Nox",
    "Robinquill Terra": "Wixen",
    "Gorirat": "Woolipop",
    "Beegarde": "Dazzi",
    "Elizabee": "Kitsun",
    "Grintale": "Eikthyrdeer",
    "Swee": "Bristla",
    "Sweepa": "Reindrix",
    "Chillet": "Beegarde",
    "Univolt": "Felbat",
    "Foxcicle": "Vaelet",
    "Pyrin": "Digtoise",
    "Pyrin Noct": "Arsox",
    "Reindrix": "Lunaris",
    "Rayhound": "Gorirat",
    "Kitsun": "Gobfin",
    "Dazzi": "Kelpsea Ignis",
    "Lunaris": "Fuddler",
    "Dinossom": "Cawgnito",
    "Dinossom Lux": "Cawgnito",
    "Surfent": "Loupmoon",
    "Surfent Terra": "Loupmoon",
    "Maraith": "Tanzee",
    "Digtoise": "Gobfin",
    "Tombat": "Gorirat",
    "Lovander": "Rushoar",
    "Flambelle": "Jolthog",
    "Vanwyrm": "Felbat",
    "Vanwyrm Cryst": "Fenglope",
    "Bushi": "Verdash",
    "Beakon": "Petallia",
    "Ragnahawk": "Broncherry",
    "Katress": "Robinquill",
    "Wixen": "Tanzee",
    "Verdash": "Wixen",
    "Vaelet": "Woolipop",
    "Sibelyx": "Dumud",
    "Elphidran": "Lovander",
    "Elphidran Aqua": "Caprity",
    "Kelpsea": "Swee",
    "Kelpsea Ignis": "Swee",
    "Azurobe": "Eikthyrdeer",
    "Cryolinx": "Rayhound",
    "Blazehowl": "Galeclaw",
    "Blazehowl Noct": "Felbat",
    "Relaxaurus": "Dinossom",
    "Relaxaurus Lux": "Chillet",
    "Broncherry": "Lunaris",
    "Broncherry Aqua": "Gobfin",
    "Petallia": "Direhowl",
    "Reptyro": "Kitsun",
    "Ice Reptyro": "Arsox",
    "Kingpaca": "Mozzarina",
    "Ice Kingpaca": "Melpaca",
    "Mammorest": "Dinossom",
    "Mammorest Cryst": "Dinossom",
    "Wumpo": "Dumud",
    "Wumpo Botan": "Mozzarina",
    "Warsect": "Digtoise",
    "Fenglope": "Wixen",
    "Felbat": "Nox",
    "Quivern": "Digtoise",
    "Blazamut": "Univolt",
    "Helzephyr": "Foxcicle",
    "Astegon": "Tombat",
    "Menasting": "Chillet",
    "Anubis": "Loupmoon",
    "Jormuntide": "Kitsun",
    "Jormuntide Ignis": "Kitsun",
    "Suzaku": "Katress",
    "Suzaku Aqua": "Univolt",
    "Grizzbolt": "Foxcicle",
    "Lyleen": "Arsox",
    "Lyleen Noct": "Petallia",
    "Faleris": "Digtoise",
    "Orserk": "Rayhound",
    "Shadowbeak": "Katress",
    "Paladius": "Blazehowl",
    "Necromus": "Blazehowl",
    "Frostallion": "Rayhound",
    "Frostallion Noct": "Blazehowl",
    "Jetragon": "Blazehowl"
  },
  "Flopie": {
    "Lamball": "Jolthog",
    "Cattiva": "Jolthog",
    "Chikipi": "Hoocrates",
    "Lifmunk": "Pengullet",
    "Foxparks": "Tocotoco",
    "Fuack": "Swee",
    "Sparkit": "Tocotoco",
    "Tanzee": "Kelpsea",
    "Rooby": "Fuddler",
    "Pengullet": "Bristla",
    "Penking": "Dumud",
    "Jolthog": "Bristla",
    "Jolthog Cryst": "Bristla",
    "Gumoss": "Kelpsea",
    "Gumoss (Special)": "Kelpsea",
    "Vixy": "Jolthog",
    "Hoocrates": "Tocotoco",
    "Teafant": "Depresso",
    "Depresso": "Fuack",
    "Cremis": "Jolthog",
    "Daedream": "Kelpsea",
    "Rushoar": "Dazzi",
    "Nox": "Daedream",
    "Fuddler": "Tanzee",
    "Killamari": "Killamari",
    "Mau": "Depresso",
    "Mau Cryst": "Jolthog",
    "Celaray": "Cawgnito",
    "Direhowl": "Wixen",
    "Tocotoco": "Ribunny",
    "Flopie": "Flopie",
    "Mozzarina": "Gobfin",
    "Bristla": "Swee",
    "Gobfin": "Woolipop",
    "Gobfin Ignis": "Woolipop",
    "Hangyu": "Pengullet",
    "Hangyu Cryst": "Pengullet",
    "Mossanda": "Digtoise",
    "Mossanda Lux": "Kitsun",
    "Woolipop": "Daedream",
    "Caprity": "Lunaris",
    "Melpaca": "Gobfin",
    "Eikthyrdeer": "Lunaris",
    "Eikthyrdeer Terra": "Gobfin",
    "Nitewing": "Digtoise",
    "Ribunny": "Killamari",
    "Incineram": "Caprity",
    "Incineram Noct": "Caprity",
    "Cinnamoth": "Melpaca",
    "Arsox": "Galeclaw",
    "Dumud": "Gobfin",
    "Cawgnito": "Nox",
    "Leezpunk": "Dazzi",
    "Leezpunk Ignis": "Dazzi",
    "Loupmoon": "Lunaris",
    "Galeclaw": "Rooby",
    "Robinquill": "Maraith",
    "Robinquill Terra": "Rushoar",
    "Gorirat": "Wixen",
    "Beegarde": "Nox",
    "Elizabee": "Chillet",
    "Grintale": "Dumud",
    "Swee": "Killamari",
    "Sweepa": "Digtoise",
    "Chillet": "Gorirat",
    "Univolt": "Fenglope",
    "Foxcicle": "Robinquill",
    "Pyrin": "Dinossom",
    "Pyrin Noct": "Foxcicle",
    "Reindrix": "Cawgnito",
    "Rayhound": "Felbat",
    "Kitsun": "Direhowl",
    "Dazzi": "Tanzee",
    "Lunaris": "Woolipop",
    "Dinossom": "Vaelet",
    "Dinossom Lux": "Gorirat",
    "Surfent": "Eikthyrdeer",
    "Surfent Terra": "Eikthyrdeer",
    "Maraith": "Dazzi",
    "Digtoise": "Direhowl",
    "Tombat": "Robinquill",
    "Lovander": "Lunaris",
    "Flambelle": "Tocotoco",
    "Vanwyrm": "Fenglope",
    "Vanwyrm Cryst": "Loupmoon",
    "Bushi": "Loupmoon",
    "Beakon": "Tombat",
    "Ragnahawk": "Kitsun",
    "Katress": "Verdash",
    "Wixen": "Fuddler",
    "Verdash": "Rushoar",
    "Vaelet": "Wixen",
    "Sibelyx": "Broncherry",
    "Elphidran": "Mozzarina",
    "Elphidran Aqua": "Mozzarina",
    "Kelpsea": "Kelpsea Ignis",
    "Kelpsea Ignis": "Kelpsea Ignis",
    "Azurobe": "Melpaca",
    "Cryolinx": "Blazehowl",
    "Blazehowl": "Verdash",
    "Blazehowl Noct": "Fenglope",
    "Relaxaurus": "Petallia",
    "Relaxaurus Lux": "Petallia",
    "Broncherry": "Beegarde",
    "Broncherry Aqua": "Direhowl",
    "Petallia": "Galeclaw",
    "Reptyro": "Chillet",
    "Ice Reptyro": "Tombat",
    "Kingpaca": "Reindrix",
    "Ice Kingpaca": "Broncherry",
    "Mammorest": "Arsox",
    "Mammorest Cryst": "Arsox",
    "Wumpo": "Celaray",
    "Wumpo Botan": "Reindrix",
    "Warsect": "Dinossom",
    "Fenglope": "Rushoar",
    "Felbat": "Maraith",
    "Quivern": "Dinossom",
    "Blazamut": "Bushi",
    "Helzephyr": "Rayhound",
    "Astegon": "Blazehowl",
    "Menasting": "Foxcicle",
    "Anubis": "Eikthyrdeer",
    "Jormuntide": "Arsox",
    "Jormuntide Ignis": "Chillet",
    "Suzaku": "Vanwyrm",
    "Suzaku Aqua": "Vanwyrm",
    "Grizzbolt": "Rayhound",
    "Lyleen": "Foxcicle",
    "Lyleen Noct": "Tombat",
    "Faleris": "Kitsun",
    "Orserk": "Blazehowl",
    "Shadowbeak": "Univolt",
    "Paladius": "Univolt",
    "Necromus": "Univolt",
    "Frostallion": "Katress",
    "Frostallion Noct": "Univolt",
    "Jetragon": "Univolt"
  },
  "Mozzarina": {
    "Lamball": "Woolipop",
    "Cattiva": "Woolipop",
    "Chikipi": "Dazzi",
    "Lifmunk": "Wixen",
    "Foxparks": "Rooby",
    "Fuack": "Leezpunk",
    "Sparkit": "Wixen",
    "Tanzee": "Cawgnito",
    "Rooby": "Galeclaw",
    "Pengullet": "Rushoar",
    "Penking": "Blazehowl",
    "Jolthog": "Rushoar",
    "Jolthog Cryst": "Rushoar",
    "Gumoss": "Cawgnito",
    "Gumoss (Special)": "Cawgnito",
    "Vixy": "Nox",
    "Hoocrates": "Maraith",
    "Teafant": "Dazzi",
    "Depresso": "Maraith",
    "Cremis": "Nox",
    "Daedream": "Beegarde",
    "Rushoar": "Robinquill",
    "Nox": "Gorirat",
    "Fuddler": "Direhowl",
    "Killamari": "Lunaris",
    "Mau": "Woolipop",
    "Mau Cryst": "Nox",
    "Celaray": "Melpaca",
    "Direhowl": "Fenglope",
    "Tocotoco": "Rushoar",
    "Flopie": "Gobfin",
    "Mozzarina": "Mozzarina",
    "Bristla": "Lunaris",
    "Gobfin": "Felbat",
    "Gobfin Ignis": "Felbat",
    "Hangyu": "Wixen",
    "Hangyu Cryst": "Wixen",
    "Mossanda": "Univolt",
    "Mossanda Lux": "Vanwyrm",
    "Woolipop": "Vaelet",
    "Caprity": "Eikthyrdeer",
    "Melpaca": "Dumud",
    "Eikthyrdeer": "Eikthyrdeer",
    "Eikthyrdeer Terra": "Mozzarina",
    "Nitewing": "Vanwyrm",
    "Ribunny": "Lunaris",
    "Incineram": "Tombat",
    "Incineram Noct": "Tombat",
    "Cinnamoth": "Katress",
    "Arsox": "Digtoise",
    "Dumud": "Mozzarina",
    "Cawgnito": "Verdash",
    "Leezpunk": "Robinquill",
    "Leezpunk Ignis": "Galeclaw",
    "Loupmoon": "Caprity",
    "Galeclaw": "Fenglope",
    "Robinquill": "Loupmoon",
    "Robinquill Terra": "Loupmoon",
    "Gorirat": "Fenglope",
    "Beegarde": "Verdash",
    "Elizabee": "Bushi",
    "Grintale": "Blazehowl",
    "Swee": "Lunaris",
    "Sweepa": "Vanwyrm",
    "Chillet": "Digtoise",
    "Univolt": "Arsox",
    "Foxcicle": "Kitsun",
    "Pyrin": "Bushi",
    "Pyrin Noct": "Anubis",
    "Reindrix": "Dumud",
    "Rayhound": "Kitsun",
    "Kitsun": "Celaray",
    "Dazzi": "Direhowl",
    "Lunaris": "Felbat",
    "Dinossom": "Broncherry",
    "Dinossom Lux": "Broncherry",
    "Surfent": "Rayhound",
    "Surfent Terra": "Rayhound",
    "Maraith": "Galeclaw",
    "Digtoise": "Reindrix",
    "Tombat": "Kitsun",
    "Lovander": "Eikthyrdeer",
    "Flambelle": "Wixen",
    "Vanwyrm": "Arsox",
    "Vanwyrm Cryst": "Foxcicle",
    "Bushi": "Petallia",
    "Beakon": "Anubis",
    "Ragnahawk": "Bushi",
    "Katress": "Chillet",
    "Wixen": "Galeclaw",
    "Verdash": "Loupmoon",
    "Vaelet": "Fenglope",
    "Sibelyx": "Univolt",
    "Elphidran": "Rayhound",
    "Elphidran Aqua": "Blazehowl",
    "Kelpsea": "Gobfin",
    "Kelpsea Ignis": "Gobfin",
    "Azurobe": "Blazehowl",
    "Cryolinx": "Penking",
    "Blazehowl": "Dinossom",
    "Blazehowl Noct": "Arsox",
    "Relaxaurus": "Incineram",
    "Relaxaurus Lux": "Incineram",
    "Broncherry": "Melpaca",
    "Broncherry Aqua": "Reindrix",
    "Petallia": "Digtoise",
    "Reptyro": "Incineram",
    "Ice Reptyro": "Anubis",
    "Kingpaca": "Univolt",
    "Ice Kingpaca": "Univolt",
    "Mammorest": "Incineram",
    "Mammorest Cryst": "Incineram",
    "Wumpo": "Univolt",
    "Wumpo Botan": "Katress",
    "Warsect": "Bushi",
    "Fenglope": "Loupmoon",
    "Felbat": "Loupmoon",
    "Quivern": "Bushi",
    "Blazamut": "Wumpo",
    "Helzephyr": "Elphidran",
    "Astegon": "Elphidran",
    "Menasting": "Incineram",
    "Anubis": "Rayhound",
    "Jormuntide": "Incineram",
    "Jormuntide Ignis": "Incineram",
    "Suzaku": "Wumpo Botan",
    "Suzaku Aqua": "Kingpaca",
    "Grizzbolt": "Surfent",
    "Lyleen": "Anubis",
    "Lyleen Noct": "Surfent",
    "Faleris": "Bushi",
    "Orserk": "Penking",
    "Shadowbeak": "Wumpo Botan",
    "Paladius": "Azurobe",
    "Necromus": "Cinnamoth",
    "Frostallion": "Penking",
    "Frostallion Noct": "Azurobe",
    "Jetragon": "Azurobe"
  },
  "Bristla": {
    "Lamball": "Foxparks",
    "Cattiva": "Hoocrates",
    "Chikipi": "Sparkit",
    "Lifmunk": "Jolthog",
    "Foxparks": "Jolthog",
    "Fuack": "Bristla",
    "Sparkit": "Jolthog",
    "Tanzee": "Killamari",
    "Rooby": "Gumoss",
    "Pengullet": "Tocotoco",
    "Penking": "Eikthyrdeer",
    "Jolthog": "Tocotoco",
    "Jolthog Cryst": "Tocotoco",
    "Gumoss": "Flopie",
    "Gumoss (Special)": "Flopie",
    "Vixy": "Depresso",
    "Hoocrates": "Pengullet",
    "Teafant": "Flambelle",
    "Depresso": "Pengullet",
    "Cremis": "Hoocrates",
    "Daedream": "Kelpsea Ignis",
    "Rushoar": "Fuddler",
    "Nox": "Tanzee",
    "Fuddler": "Kelpsea Ignis",
    "Killamari": "Swee",
    "Mau": "Foxparks",
    "Mau Cryst": "Depresso",
    "Celaray": "Gobfin",
    "Direhowl": "Woolipop",
    "Tocotoco": "Fuack",
    "Flopie": "Swee",
    "Mozzarina": "Lunaris",
    "Bristla": "Bristla",
    "Gobfin": "Dazzi",
    "Gobfin Ignis": "Dazzi",
    "Hangyu": "Jolthog",
    "Hangyu Cryst": "Jolthog",
    "Mossanda": "Reindrix",
    "Mossanda Lux": "Digtoise",
    "Woolipop": "Kelpsea",
    "Caprity": "Rushoar",
    "Melpaca": "Lunaris",
    "Eikthyrdeer": "Leezpunk",
    "Eikthyrdeer Terra": "Lunaris",
    "Nitewing": "Celaray",
    "Ribunny": "Bristla",
    "Incineram": "Loupmoon",
    "Incineram Noct": "Loupmoon",
    "Cinnamoth": "Mozzarina",
    "Arsox": "Direhowl",
    "Dumud": "Lunaris",
    "Cawgnito": "Dazzi",
    "Leezpunk": "Fuddler",
    "Leezpunk Ignis": "Daedream",
    "Loupmoon": "Rushoar",
    "Galeclaw": "Nox",
    "Robinquill": "Wixen",
    "Robinquill Terra": "Wixen",
    "Gorirat": "Nox",
    "Beegarde": "Woolipop",
    "Elizabee": "Kitsun",
    "Grintale": "Eikthyrdeer",
    "Swee": "Ribunny",
    "Sweepa": "Broncherry",
    "Chillet": "Direhowl",
    "Univolt": "Felbat",
    "Foxcicle": "Gorirat",
    "Pyrin": "Digtoise",
    "Pyrin Noct": "Petallia",
    "Reindrix": "Lunaris",
    "Rayhound": "Galeclaw",
    "Kitsun": "Cawgnito",
    "Dazzi": "Kelpsea",
    "Lunaris": "Dazzi",
    "Dinossom": "Beegarde",
    "Dinossom Lux": "Direhowl",
    "Surfent": "Lovander",
    "Surfent Terra": "Caprity",
    "Maraith": "Daedream",
    "Digtoise": "Gobfin",
    "Tombat": "Galeclaw",
    "Lovander": "Rushoar",
    "Flambelle": "Jolthog",
    "Vanwyrm": "Verdash",
    "Vanwyrm Cryst": "Fenglope",
    "Bushi": "Fenglope",
    "Beakon": "Foxcicle",
    "Ragnahawk": "Digtoise",
    "Katress": "Felbat",
    "Wixen": "Gumoss",
    "Verdash": "Rooby",
    "Vaelet": "Woolipop",
    "Sibelyx": "Melpaca",
    "Elphidran": "Caprity",
    "Elphidran Aqua": "Eikthyrdeer",
    "Kelpsea": "Killamari",
    "Kelpsea Ignis": "Killamari",
    "Azurobe": "Mozzarina",
    "Cryolinx": "Rayhound",
    "Blazehowl": "Robinquill",
    "Blazehowl Noct": "Verdash",
    "Relaxaurus": "Chillet",
    "Relaxaurus Lux": "Arsox",
    "Broncherry": "Gobfin",
    "Broncherry Aqua": "Cawgnito",
    "Petallia": "Vaelet",
    "Reptyro": "Dinossom",
    "Ice Reptyro": "Petallia",
    "Kingpaca": "Dumud",
    "Ice Kingpaca": "Reindrix",
    "Mammorest": "Dinossom",
    "Mammorest Cryst": "Chillet",
    "Wumpo": "Melpaca",
    "Wumpo Botan": "Dumud",
    "Warsect": "Kitsun",
    "Fenglope": "Maraith",
    "Felbat": "Wixen",
    "Quivern": "Kitsun",
    "Blazamut": "Vanwyrm",
    "Helzephyr": "Tombat",
    "Astegon": "Rayhound",
    "Menasting": "Arsox",
    "Anubis": "Loupmoon",
    "Jormuntide": "Dinossom",
    "Jormuntide Ignis": "Dinossom",
    "Suzaku": "Univolt",
    "Suzaku Aqua": "Univolt",
    "Grizzbolt": "Foxcicle",
    "Lyleen": "Arsox",
    "Lyleen Noct": "Foxcicle",
    "Faleris": "Digtoise",
    "Orserk": "Rayhound",
    "Shadowbeak": "Univolt",
    "Paladius": "Katress",
    "Necromus": "Katress",
    "Frostallion": "Blazehowl",
    "Frostallion Noct": "Blazehowl",
    "Jetragon": "Blazehowl"
  },
  "Gobfin": {
    "Lamball": "Flopie",
    "Cattiva": "Kelpsea Ignis",
    "Chikipi": "Killamari",
    "Lifmunk": "Kelpsea",
    "Foxparks": "Tanzee",
    "Fuack": "Dazzi",
    "Sparkit": "Tanzee",
    "Tanzee": "Wixen",
    "Rooby": "Gobfin Ignis",
    "Pengullet": "Fuddler",
    "Penking": "Chillet",
    "Jolthog": "Daedream",
    "Jolthog Cryst": "Fuddler",
    "Gumoss": "Wixen",
    "Gumoss (Special)": "Wixen",
    "Vixy": "Kelpsea Ignis",
    "Hoocrates": "Gumoss",
    "Teafant": "Killamari",
    "Depresso": "Daedream",
    "Cremis": "Kelpsea Ignis",
    "Daedream": "Wixen",
    "Rushoar": "Lunaris",
    "Nox": "Rushoar",
    "Fuddler": "Rooby",
    "Killamari": "Woolipop",
    "Mau": "Killamari",
    "Mau Cryst": "Kelpsea",
    "Celaray": "Fenglope",
    "Direhowl": "Cawgnito",
    "Tocotoco": "Dazzi",
    "Flopie": "Woolipop",
    "Mozzarina": "Felbat",
    "Bristla": "Dazzi",
    "Gobfin": "Gobfin",
    "Gobfin Ignis": "Gobfin",
    "Hangyu": "Kelpsea",
    "Hangyu Cryst": "Kelpsea",
    "Mossanda": "Foxcicle",
    "Mossanda Lux": "Rayhound",
    "Woolipop": "Rushoar",
    "Caprity": "Felbat",
    "Melpaca": "Verdash",
    "Eikthyrdeer": "Felbat",
    "Eikthyrdeer Terra": "Verdash",
    "Nitewing": "Tombat",
    "Ribunny": "Dazzi",
    "Incineram": "Digtoise",
    "Incineram Noct": "Kitsun",
    "Cinnamoth": "Arsox",
    "Arsox": "Lovander",
    "Dumud": "Verdash",
    "Cawgnito": "Gobfin",
    "Leezpunk": "Lunaris",
    "Leezpunk Ignis": "Lunaris",
    "Loupmoon": "Robinquill",
    "Galeclaw": "Direhowl",
    "Robinquill": "Direhowl",
    "Robinquill Terra": "Gorirat",
    "Gorirat": "Direhowl",
    "Beegarde": "Cawgnito",
    "Elizabee": "Blazehowl",
    "Grintale": "Chillet",
    "Swee": "Woolipop",
    "Sweepa": "Tombat",
    "Chillet": "Loupmoon",
    "Univolt": "Melpaca",
    "Foxcicle": "Eikthyrdeer",
    "Pyrin": "Rayhound",
    "Pyrin Noct": "Vanwyrm",
    "Reindrix": "Fenglope",
    "Rayhound": "Eikthyrdeer",
    "Kitsun": "Loupmoon",
    "Dazzi": "Maraith",
    "Lunaris": "Lunaris",
    "Dinossom": "Loupmoon",
    "Dinossom Lux": "Loupmoon",
    "Surfent": "Kitsun",
    "Surfent Terra": "Dinossom",
    "Maraith": "Leezpunk",
    "Digtoise": "Fenglope",
    "Tombat": "Eikthyrdeer",
    "Lovander": "Robinquill",
    "Flambelle": "Tanzee",
    "Vanwyrm": "Reindrix",
    "Vanwyrm Cryst": "Digtoise",
    "Bushi": "Broncherry",
    "Beakon": "Vanwyrm",
    "Ragnahawk": "Rayhound",
    "Katress": "Dumud",
    "Wixen": "Rushoar",
    "Verdash": "Gorirat",
    "Vaelet": "Beegarde",
    "Sibelyx": "Foxcicle",
    "Elphidran": "Dinossom",
    "Elphidran Aqua": "Dinossom",
    "Kelpsea": "Nox",
    "Kelpsea Ignis": "Nox",
    "Azurobe": "Arsox",
    "Cryolinx": "Incineram",
    "Blazehowl": "Dumud",
    "Blazehowl Noct": "Reindrix",
    "Relaxaurus": "Univolt",
    "Relaxaurus Lux": "Univolt",
    "Broncherry": "Fenglope",
    "Broncherry Aqua": "Loupmoon",
    "Petallia": "Caprity",
    "Reptyro": "Blazehowl",
    "Ice Reptyro": "Vanwyrm",
    "Kingpaca": "Petallia",
    "Ice Kingpaca": "Foxcicle",
    "Mammorest": "Katress",
    "Mammorest Cryst": "Univolt",
    "Wumpo": "Petallia",
    "Wumpo Botan": "Arsox",
    "Warsect": "Blazehowl",
    "Fenglope": "Galeclaw",
    "Felbat": "Vaelet",
    "Quivern": "Blazehowl",
    "Blazamut": "Elphidran",
    "Helzephyr": "Bushi",
    "Astegon": "Bushi",
    "Menasting": "Univolt",
    "Anubis": "Kitsun",
    "Jormuntide": "Katress",
    "Jormuntide Ignis": "Katress",
    "Suzaku": "Anubis",
    "Suzaku Aqua": "Surfent",
    "Grizzbolt": "Bushi",
    "Lyleen": "Univolt",
    "Lyleen Noct": "Vanwyrm",
    "Faleris": "Rayhound",
    "Orserk": "Incineram",
    "Shadowbeak": "Anubis",
    "Paladius": "Incineram",
    "Necromus": "Anubis",
    "Frostallion": "Incineram",
    "Frostallion Noct": "Incineram",
    "Jetragon": "Incineram"
  },
  "Gobfin Ignis": {
    "variant": true,
    "Lamball": "Killamari",
    "Cattiva": "Flopie",
    "Chikipi": "Swee",
    "Lifmunk": "Kelpsea",
    "Foxparks": "Tanzee",
    "Fuack": "Dazzi",
    "Sparkit": "Kelpsea",
    "Tanzee": "Nox",
    "Rooby": "Rushoar",
    "Pengullet": "Fuddler",
    "Penking": "Dinossom",
    "Jolthog": "Daedream",
    "Jolthog Cryst": "Daedream",
    "Gumoss": "Wixen",
    "Gumoss (Special)": "Wixen",
    "Vixy": "Kelpsea Ignis",
    "Hoocrates": "Tanzee",
    "Teafant": "Killamari",
    "Depresso": "Gumoss",
    "Cremis": "Flopie",
    "Daedream": "Wixen",
    "Rushoar": "Lunaris",
    "Nox": "Rushoar",
    "Fuddler": "Wixen",
    "Killamari": "Woolipop",
    "Mau": "Killamari",
    "Mau Cryst": "Kelpsea Ignis",
    "Celaray": "Fenglope",
    "Direhowl": "Cawgnito",
    "Tocotoco": "Fuddler",
    "Flopie": "Woolipop",
    "Mozzarina": "Felbat",
    "Bristla": "Dazzi",
    "Gobfin": "Gobfin",
    "Gobfin Ignis": "Gobfin Ignis",
    "Hangyu": "Kelpsea",
    "Hangyu Cryst": "Kelpsea",
    "Mossanda": "Foxcicle",
    "Mossanda Lux": "Tombat",
    "Woolipop": "Maraith",
    "Caprity": "Robinquill",
    "Melpaca": "Verdash",
    "Eikthyrdeer": "Felbat",
    "Eikthyrdeer Terra": "Felbat",
    "Nitewing": "Foxcicle",
    "Ribunny": "Dazzi",
    "Incineram": "Digtoise",
    "Incineram Noct": "Digtoise",
    "Cinnamoth": "Arsox",
    "Arsox": "Loupmoon",
    "Dumud": "Verdash",
    "Cawgnito": "Gobfin",
    "Leezpunk": "Lunaris",
    "Leezpunk Ignis": "Leezpunk",
    "Loupmoon": "Galeclaw",
    "Galeclaw": "Direhowl",
    "Robinquill": "Direhowl",
    "Robinquill Terra": "Vaelet",
    "Gorirat": "Beegarde",
    "Beegarde": "Gobfin",
    "Elizabee": "Blazehowl",
    "Grintale": "Chillet",
    "Swee": "Dazzi",
    "Sweepa": "Tombat",
    "Chillet": "Loupmoon",
    "Univolt": "Melpaca",
    "Foxcicle": "Caprity",
    "Pyrin": "Rayhound",
    "Pyrin Noct": "Univolt",
    "Reindrix": "Verdash",
    "Rayhound": "Eikthyrdeer",
    "Kitsun": "Loupmoon",
    "Dazzi": "Rooby",
    "Lunaris": "Lunaris",
    "Dinossom": "Loupmoon",
    "Dinossom Lux": "Loupmoon",
    "Surfent": "Kitsun",
    "Surfent Terra": "Kitsun",
    "Maraith": "Rushoar",
    "Digtoise": "Fenglope",
    "Tombat": "Eikthyrdeer",
    "Lovander": "Robinquill",
    "Flambelle": "Tanzee",
    "Vanwyrm": "Reindrix",
    "Vanwyrm Cryst": "Broncherry",
    "Bushi": "Celaray",
    "Beakon": "Vanwyrm",
    "Ragnahawk": "Rayhound",
    "Katress": "Dumud",
    "Wixen": "Rushoar",
    "Verdash": "Gorirat",
    "Vaelet": "Cawgnito",
    "Sibelyx": "Petallia",
    "Elphidran": "Dinossom",
    "Elphidran Aqua": "Dinossom",
    "Kelpsea": "Nox",
    "Kelpsea Ignis": "Woolipop",
    "Azurobe": "Chillet",
    "Cryolinx": "Incineram",
    "Blazehowl": "Mozzarina",
    "Blazehowl Noct": "Melpaca",
    "Relaxaurus": "Univolt",
    "Relaxaurus Lux": "Univolt",
    "Broncherry": "Fenglope",
    "Broncherry Aqua": "Fenglope",
    "Petallia": "Lovander",
    "Reptyro": "Blazehowl",
    "Ice Reptyro": "Vanwyrm",
    "Kingpaca": "Arsox",
    "Ice Kingpaca": "Foxcicle",
    "Mammorest": "Katress",
    "Mammorest Cryst": "Katress",
    "Wumpo": "Petallia",
    "Wumpo Botan": "Arsox",
    "Warsect": "Blazehowl",
    "Fenglope": "Gorirat",
    "Felbat": "Direhowl",
    "Quivern": "Rayhound",
    "Blazamut": "Surfent",
    "Helzephyr": "Bushi",
    "Astegon": "Bushi",
    "Menasting": "Univolt",
    "Anubis": "Kitsun",
    "Jormuntide": "Blazehowl",
    "Jormuntide Ignis": "Blazehowl",
    "Suzaku": "Anubis",
    "Suzaku Aqua": "Anubis",
    "Grizzbolt": "Vanwyrm",
    "Lyleen": "Univolt",
    "Lyleen Noct": "Vanwyrm",
    "Faleris": "Rayhound",
    "Orserk": "Bushi",
    "Shadowbeak": "Anubis",
    "Paladius": "Incineram",
    "Necromus": "Incineram",
    "Frostallion": "Incineram",
    "Frostallion Noct": "Incineram",
    "Jetragon": "Incineram"
  },
  "Hangyu": {
    "Lamball": "Vixy",
    "Cattiva": "Lifmunk",
    "Chikipi": "Cattiva",
    "Lifmunk": "Lifmunk",
    "Foxparks": "Sparkit",
    "Fuack": "Jolthog",
    "Sparkit": "Hangyu",
    "Tanzee": "Tocotoco",
    "Rooby": "Killamari",
    "Pengullet": "Depresso",
    "Penking": "Fenglope",
    "Jolthog": "Foxparks",
    "Jolthog Cryst": "Hoocrates",
    "Gumoss": "Fuack",
    "Gumoss (Special)": "Fuack",
    "Vixy": "Lifmunk",
    "Hoocrates": "Flambelle",
    "Teafant": "Cremis",
    "Depresso": "Foxparks",
    "Cremis": "Lifmunk",
    "Daedream": "Bristla",
    "Rushoar": "Kelpsea Ignis",
    "Nox": "Swee",
    "Fuddler": "Bristla",
    "Killamari": "Pengullet",
    "Mau": "Vixy",
    "Mau Cryst": "Lifmunk",
    "Celaray": "Maraith",
    "Direhowl": "Gumoss",
    "Tocotoco": "Depresso",
    "Flopie": "Pengullet",
    "Mozzarina": "Wixen",
    "Bristla": "Jolthog",
    "Gobfin": "Kelpsea",
    "Gobfin Ignis": "Kelpsea",
    "Hangyu": "Hangyu",
    "Hangyu Cryst": "Hangyu",
    "Mossanda": "Eikthyrdeer",
    "Mossanda Lux": "Mozzarina",
    "Woolipop": "Swee",
    "Caprity": "Nox",
    "Melpaca": "Rooby",
    "Eikthyrdeer": "Eikthyrdeer Terra",
    "Eikthyrdeer Terra": "Wixen",
    "Nitewing": "Eikthyrdeer",
    "Ribunny": "Jolthog",
    "Incineram": "Felbat",
    "Incineram Noct": "Felbat",
    "Cinnamoth": "Loupmoon",
    "Arsox": "Lunaris",
    "Dumud": "Wixen",
    "Cawgnito": "Tanzee",
    "Leezpunk": "Kelpsea Ignis",
    "Leezpunk Ignis": "Flopie",
    "Loupmoon": "Woolipop",
    "Galeclaw": "Fuddler",
    "Robinquill": "Fuddler",
    "Robinquill Terra": "Dazzi",
    "Gorirat": "Daedream",
    "Beegarde": "Tanzee",
    "Elizabee": "Reindrix",
    "Grintale": "Loupmoon",
    "Swee": "Hangyu Cryst",
    "Sweepa": "Eikthyrdeer",
    "Chillet": "Lunaris",
    "Univolt": "Vaelet",
    "Foxcicle": "Gobfin",
    "Pyrin": "Melpaca",
    "Pyrin Noct": "Kitsun",
    "Reindrix": "Maraith",
    "Rayhound": "Cawgnito",
    "Kitsun": "Rushoar",
    "Dazzi": "Bristla",
    "Lunaris": "Kelpsea",
    "Dinossom": "Leezpunk",
    "Dinossom Lux": "Lunaris",
    "Surfent": "Verdash",
    "Surfent Terra": "Fenglope",
    "Maraith": "Killamari",
    "Digtoise": "Rushoar",
    "Tombat": "Gobfin",
    "Lovander": "Nox",
    "Flambelle": "Sparkit",
    "Vanwyrm": "Gorirat",
    "Vanwyrm Cryst": "Robinquill",
    "Bushi": "Galeclaw",
    "Beakon": "Dinossom",
    "Ragnahawk": "Dumud",
    "Katress": "Direhowl",
    "Wixen": "Killamari",
    "Verdash": "Dazzi",
    "Vaelet": "Daedream",
    "Sibelyx": "Caprity",
    "Elphidran": "Fenglope",
    "Elphidran Aqua": "Fenglope",
    "Kelpsea": "Tocotoco",
    "Kelpsea Ignis": "Tocotoco",
    "Azurobe": "Loupmoon",
    "Cryolinx": "Petallia",
    "Blazehowl": "Direhowl",
    "Blazehowl Noct": "Gorirat",
    "Relaxaurus": "Digtoise",
    "Relaxaurus Lux": "Digtoise",
    "Broncherry": "Rushoar",
    "Broncherry Aqua": "Rushoar",
    "Petallia": "Lunaris",
    "Reptyro": "Celaray",
    "Ice Reptyro": "Kitsun",
    "Kingpaca": "Loupmoon",
    "Ice Kingpaca": "Caprity",
    "Mammorest": "Broncherry",
    "Mammorest Cryst": "Digtoise",
    "Wumpo": "Lovander",
    "Wumpo Botan": "Loupmoon",
    "Warsect": "Reindrix",
    "Fenglope": "Dazzi",
    "Felbat": "Dazzi",
    "Quivern": "Melpaca",
    "Blazamut": "Blazehowl",
    "Helzephyr": "Chillet",
    "Astegon": "Arsox",
    "Menasting": "Digtoise",
    "Anubis": "Verdash",
    "Jormuntide": "Broncherry",
    "Jormuntide Ignis": "Celaray",
    "Suzaku": "Rayhound",
    "Suzaku Aqua": "Rayhound",
    "Grizzbolt": "Dinossom",
    "Lyleen": "Kitsun",
    "Lyleen Noct": "Dinossom",
    "Faleris": "Dumud",
    "Orserk": "Petallia",
    "Shadowbeak": "Rayhound",
    "Paladius": "Tombat",
    "Necromus": "Tombat",
    "Frostallion": "Foxcicle",
    "Frostallion Noct": "Foxcicle",
    "Jetragon": "Tombat"
  },
  "Hangyu Cryst": {
    "variant": true,
    "Lamball": "Vixy",
    "Cattiva": "Vixy",
    "Chikipi": "Cattiva",
    "Lifmunk": "Lifmunk",
    "Foxparks": "Sparkit",
    "Fuack": "Depresso",
    "Sparkit": "Hangyu",
    "Tanzee": "Tocotoco",
    "Rooby": "Killamari",
    "Pengullet": "Hoocrates",
    "Penking": "Fenglope",
    "Jolthog": "Foxparks",
    "Jolthog Cryst": "Hoocrates",
    "Gumoss": "Fuack",
    "Gumoss (Special)": "Fuack",
    "Vixy": "Lifmunk",
    "Hoocrates": "Flambelle",
    "Teafant": "Cremis",
    "Depresso": "Foxparks",
    "Cremis": "Lifmunk",
    "Daedream": "Fuack",
    "Rushoar": "Flopie",
    "Nox": "Swee",
    "Fuddler": "Bristla",
    "Killamari": "Pengullet",
    "Mau": "Vixy",
    "Mau Cryst": "Lifmunk",
    "Celaray": "Maraith",
    "Direhowl": "Gumoss",
    "Tocotoco": "Depresso",
    "Flopie": "Pengullet",
    "Mozzarina": "Wixen",
    "Bristla": "Jolthog",
    "Gobfin": "Kelpsea",
    "Gobfin Ignis": "Kelpsea",
    "Hangyu": "Hangyu",
    "Hangyu Cryst": "Hangyu Cryst",
    "Mossanda": "Caprity",
    "Mossanda Lux": "Mozzarina",
    "Woolipop": "Ribunny",
    "Caprity": "Nox",
    "Melpaca": "Rooby",
    "Eikthyrdeer": "Nox",
    "Eikthyrdeer Terra": "Wixen",
    "Nitewing": "Eikthyrdeer",
    "Ribunny": "Jolthog",
    "Incineram": "Felbat",
    "Incineram Noct": "Felbat",
    "Cinnamoth": "Loupmoon",
    "Arsox": "Lunaris",
    "Dumud": "Wixen",
    "Cawgnito": "Tanzee",
    "Leezpunk": "Kelpsea Ignis",
    "Leezpunk Ignis": "Flopie",
    "Loupmoon": "Woolipop",
    "Galeclaw": "Daedream",
    "Robinquill": "Fuddler",
    "Robinquill Terra": "Dazzi",
    "Gorirat": "Daedream",
    "Beegarde": "Tanzee",
    "Elizabee": "Reindrix",
    "Grintale": "Fenglope",
    "Swee": "Jolthog",
    "Sweepa": "Eikthyrdeer",
    "Chillet": "Lunaris",
    "Univolt": "Vaelet",
    "Foxcicle": "Gobfin",
    "Pyrin": "Melpaca",
    "Pyrin Noct": "Kitsun",
    "Reindrix": "Maraith",
    "Rayhound": "Cawgnito",
    "Kitsun": "Rushoar",
    "Dazzi": "Bristla",
    "Lunaris": "Kelpsea Ignis",
    "Dinossom": "Leezpunk",
    "Dinossom Lux": "Leezpunk",
    "Surfent": "Verdash",
    "Surfent Terra": "Verdash",
    "Maraith": "Killamari",
    "Digtoise": "Rushoar",
    "Tombat": "Gobfin",
    "Lovander": "Nox",
    "Flambelle": "Sparkit",
    "Vanwyrm": "Gorirat",
    "Vanwyrm Cryst": "Robinquill",
    "Bushi": "Galeclaw",
    "Beakon": "Dinossom",
    "Ragnahawk": "Dumud",
    "Katress": "Direhowl",
    "Wixen": "Killamari",
    "Verdash": "Dazzi",
    "Vaelet": "Gumoss",
    "Sibelyx": "Lovander",
    "Elphidran": "Fenglope",
    "Elphidran Aqua": "Fenglope",
    "Kelpsea": "Tocotoco",
    "Kelpsea Ignis": "Pengullet",
    "Azurobe": "Loupmoon",
    "Cryolinx": "Petallia",
    "Blazehowl": "Beegarde",
    "Blazehowl Noct": "Vaelet",
    "Relaxaurus": "Digtoise",
    "Relaxaurus Lux": "Digtoise",
    "Broncherry": "Maraith",
    "Broncherry Aqua": "Rushoar",
    "Petallia": "Lunaris",
    "Reptyro": "Celaray",
    "Ice Reptyro": "Kitsun",
    "Kingpaca": "Loupmoon",
    "Ice Kingpaca": "Caprity",
    "Mammorest": "Broncherry",
    "Mammorest Cryst": "Broncherry",
    "Wumpo": "Lovander",
    "Wumpo Botan": "Loupmoon",
    "Warsect": "Reindrix",
    "Fenglope": "Dazzi",
    "Felbat": "Fuddler",
    "Quivern": "Melpaca",
    "Blazamut": "Blazehowl",
    "Helzephyr": "Chillet",
    "Astegon": "Arsox",
    "Menasting": "Digtoise",
    "Anubis": "Verdash",
    "Jormuntide": "Celaray",
    "Jormuntide Ignis": "Celaray",
    "Suzaku": "Rayhound",
    "Suzaku Aqua": "Rayhound",
    "Grizzbolt": "Dinossom",
    "Lyleen": "Kitsun",
    "Lyleen Noct": "Dinossom",
    "Faleris": "Dumud",
    "Orserk": "Petallia",
    "Shadowbeak": "Rayhound",
    "Paladius": "Tombat",
    "Necromus": "Tombat",
    "Frostallion": "Petallia",
    "Frostallion Noct": "Foxcicle",
    "Jetragon": "Foxcicle"
  },
  "Mossanda": {
    "Lamball": "Loupmoon",
    "Cattiva": "Loupmoon",
    "Chikipi": "Loupmoon",
    "Lifmunk": "Caprity",
    "Foxparks": "Eikthyrdeer",
    "Fuack": "Reindrix",
    "Sparkit": "Eikthyrdeer",
    "Tanzee": "Digtoise",
    "Rooby": "Arsox",
    "Pengullet": "Melpaca",
    "Penking": "Wumpo Botan",
    "Jolthog": "Dumud",
    "Jolthog Cryst": "Dumud",
    "Gumoss": "Kitsun",
    "Gumoss (Special)": "Kitsun",
    "Vixy": "Lovander",
    "Hoocrates": "Mozzarina",
    "Teafant": "Loupmoon",
    "Depresso": "Mozzarina",
    "Cremis": "Lovander",
    "Daedream": "Kitsun",
    "Rushoar": "Petallia",
    "Nox": "Chillet",
    "Fuddler": "Kitsun",
    "Killamari": "Broncherry",
    "Mau": "Loupmoon",
    "Mau Cryst": "Caprity",
    "Celaray": "Vanwyrm",
    "Direhowl": "Tombat",
    "Tocotoco": "Melpaca",
    "Flopie": "Digtoise",
    "Mozzarina": "Univolt",
    "Bristla": "Reindrix",
    "Gobfin": "Foxcicle",
    "Gobfin Ignis": "Foxcicle",
    "Hangyu": "Eikthyrdeer",
    "Hangyu Cryst": "Caprity",
    "Mossanda": "Mossanda",
    "Mossanda Lux": "Sweepa",
    "Woolipop": "Dinossom",
    "Caprity": "Univolt",
    "Melpaca": "Vanwyrm",
    "Eikthyrdeer": "Univolt",
    "Eikthyrdeer Terra": "Vanwyrm",
    "Nitewing": "Nitewing",
    "Ribunny": "Celaray",
    "Incineram": "Grintale",
    "Incineram Noct": "Azurobe",
    "Cinnamoth": "Wumpo",
    "Arsox": "Incineram",
    "Dumud": "Vanwyrm",
    "Cawgnito": "Tombat",
    "Leezpunk": "Petallia",
    "Leezpunk Ignis": "Arsox",
    "Loupmoon": "Univolt",
    "Galeclaw": "Rayhound",
    "Robinquill": "Rayhound",
    "Robinquill Terra": "Blazehowl",
    "Gorirat": "Rayhound",
    "Beegarde": "Tombat",
    "Elizabee": "Ragnahawk",
    "Grintale": "Kingpaca",
    "Swee": "Broncherry",
    "Sweepa": "Nitewing",
    "Chillet": "Incineram",
    "Univolt": "Surfent",
    "Foxcicle": "Incineram",
    "Pyrin": "Sweepa",
    "Pyrin Noct": "Elizabee",
    "Reindrix": "Vanwyrm",
    "Rayhound": "Grizzbolt",
    "Kitsun": "Bushi",
    "Dazzi": "Dinossom",
    "Lunaris": "Foxcicle",
    "Dinossom": "Bushi",
    "Dinossom Lux": "Bushi",
    "Surfent": "Azurobe",
    "Surfent Terra": "Cinnamoth",
    "Maraith": "Arsox",
    "Digtoise": "Bushi",
    "Tombat": "Incineram",
    "Lovander": "Univolt",
    "Flambelle": "Eikthyrdeer",
    "Vanwyrm": "Elphidran",
    "Vanwyrm Cryst": "Penking",
    "Bushi": "Elphidran",
    "Beakon": "Reptyro",
    "Ragnahawk": "Sweepa",
    "Katress": "Anubis",
    "Wixen": "Arsox",
    "Verdash": "Blazehowl",
    "Vaelet": "Rayhound",
    "Sibelyx": "Sibelyx",
    "Elphidran": "Wumpo Botan",
    "Elphidran Aqua": "Wumpo Botan",
    "Kelpsea": "Digtoise",
    "Kelpsea Ignis": "Digtoise",
    "Azurobe": "Wumpo",
    "Cryolinx": "Relaxaurus",
    "Blazehowl": "Anubis",
    "Blazehowl Noct": "Elphidran",
    "Relaxaurus": "Pyrin",
    "Relaxaurus Lux": "Quivern",
    "Broncherry": "Bushi",
    "Broncherry Aqua": "Bushi",
    "Petallia": "Lyleen",
    "Reptyro": "Ragnahawk",
    "Ice Reptyro": "Elizabee",
    "Kingpaca": "Sibelyx",
    "Ice Kingpaca": "Mossanda",
    "Mammorest": "Pyrin",
    "Mammorest Cryst": "Pyrin",
    "Wumpo": "Sibelyx",
    "Wumpo Botan": "Sibelyx",
    "Warsect": "Ragnahawk",
    "Fenglope": "Blazehowl",
    "Felbat": "Blazehowl",
    "Quivern": "Ragnahawk",
    "Blazamut": "Beakon",
    "Helzephyr": "Jormuntide",
    "Astegon": "Relaxaurus",
    "Menasting": "Warsect",
    "Anubis": "Azurobe",
    "Jormuntide": "Pyrin",
    "Jormuntide Ignis": "Ragnahawk",
    "Suzaku": "Beakon",
    "Suzaku Aqua": "Beakon",
    "Grizzbolt": "Mossanda Lux",
    "Lyleen": "Warsect",
    "Lyleen Noct": "Reptyro",
    "Faleris": "Sweepa",
    "Orserk": "Relaxaurus",
    "Shadowbeak": "Menasting",
    "Paladius": "Menasting",
    "Necromus": "Menasting",
    "Frostallion": "Relaxaurus",
    "Frostallion Noct": "Menasting",
    "Jetragon": "Menasting"
  },
  "Mossanda Lux": {
    "variant": true,
    "Lamball": "Caprity",
    "Cattiva": "Eikthyrdeer",
    "Chikipi": "Loupmoon",
    "Lifmunk": "Mozzarina",
    "Foxparks": "Dumud",
    "Fuack": "Broncherry",
    "Sparkit": "Dumud",
    "Tanzee": "Dinossom",
    "Rooby": "Petallia",
    "Pengullet": "Celaray",
    "Penking": "Sibelyx",
    "Jolthog": "Reindrix",
    "Jolthog Cryst": "Reindrix",
    "Gumoss": "Dinossom",
    "Gumoss (Special)": "Dinossom",
    "Vixy": "Eikthyrdeer",
    "Hoocrates": "Melpaca",
    "Teafant": "Lovander",
    "Depresso": "Melpaca",
    "Cremis": "Eikthyrdeer",
    "Daedream": "Dinossom",
    "Rushoar": "Foxcicle",
    "Nox": "Arsox",
    "Fuddler": "Chillet",
    "Killamari": "Digtoise",
    "Mau": "Caprity",
    "Mau Cryst": "Eikthyrdeer",
    "Celaray": "Bushi",
    "Direhowl": "Rayhound",
    "Tocotoco": "Broncherry",
    "Flopie": "Kitsun",
    "Mozzarina": "Vanwyrm",
    "Bristla": "Digtoise",
    "Gobfin": "Rayhound",
    "Gobfin Ignis": "Tombat",
    "Hangyu": "Mozzarina",
    "Hangyu Cryst": "Mozzarina",
    "Mossanda": "Sweepa",
    "Mossanda Lux": "Mossanda Lux",
    "Woolipop": "Arsox",
    "Caprity": "Vanwyrm",
    "Melpaca": "Bushi",
    "Eikthyrdeer": "Vanwyrm",
    "Eikthyrdeer Terra": "Bushi",
    "Nitewing": "Sweepa",
    "Ribunny": "Digtoise",
    "Incineram": "Cinnamoth",
    "Incineram Noct": "Wumpo Botan",
    "Cinnamoth": "Sibelyx",
    "Arsox": "Incineram",
    "Dumud": "Bushi",
    "Cawgnito": "Rayhound",
    "Leezpunk": "Tombat",
    "Leezpunk Ignis": "Foxcicle",
    "Loupmoon": "Univolt",
    "Galeclaw": "Blazehowl",
    "Robinquill": "Blazehowl",
    "Robinquill Terra": "Katress",
    "Gorirat": "Blazehowl",
    "Beegarde": "Rayhound",
    "Elizabee": "Pyrin",
    "Grintale": "Sibelyx",
    "Swee": "Digtoise",
    "Sweepa": "Sweepa",
    "Chillet": "Incineram",
    "Univolt": "Elphidran",
    "Foxcicle": "Anubis",
    "Pyrin": "Ragnahawk",
    "Pyrin Noct": "Jormuntide",
    "Reindrix": "Bushi",
    "Rayhound": "Anubis",
    "Kitsun": "Incineram",
    "Dazzi": "Chillet",
    "Lunaris": "Tombat",
    "Dinossom": "Incineram",
    "Dinossom Lux": "Incineram",
    "Surfent": "Wumpo Botan",
    "Surfent Terra": "Kingpaca",
    "Maraith": "Foxcicle",
    "Digtoise": "Bushi",
    "Tombat": "Anubis",
    "Lovander": "Vanwyrm",
    "Flambelle": "Dumud",
    "Vanwyrm": "Penking",
    "Vanwyrm Cryst": "Azurobe",
    "Bushi": "Penking",
    "Beakon": "Jormuntide",
    "Ragnahawk": "Ragnahawk",
    "Katress": "Elphidran",
    "Wixen": "Petallia",
    "Verdash": "Univolt",
    "Vaelet": "Blazehowl",
    "Sibelyx": "Nitewing",
    "Elphidran": "Wumpo",
    "Elphidran Aqua": "Wumpo",
    "Kelpsea": "Kitsun",
    "Kelpsea Ignis": "Kitsun",
    "Azurobe": "Sibelyx",
    "Cryolinx": "Menasting",
    "Blazehowl": "Elphidran",
    "Blazehowl Noct": "Elphidran",
    "Relaxaurus": "Elizabee",
    "Relaxaurus Lux": "Elizabee",
    "Broncherry": "Bushi",
    "Broncherry Aqua": "Incineram",
    "Petallia": "Incineram",
    "Reptyro": "Pyrin",
    "Ice Reptyro": "Jormuntide",
    "Kingpaca": "Mossanda",
    "Ice Kingpaca": "Nitewing",
    "Mammorest": "Warsect",
    "Mammorest Cryst": "Warsect",
    "Wumpo": "Nitewing",
    "Wumpo Botan": "Mossanda",
    "Warsect": "Pyrin",
    "Fenglope": "Univolt",
    "Felbat": "Katress",
    "Quivern": "Pyrin",
    "Blazamut": "Helzephyr",
    "Helzephyr": "Relaxaurus",
    "Astegon": "Relaxaurus",
    "Menasting": "Reptyro",
    "Anubis": "Wumpo Botan",
    "Jormuntide": "Quivern",
    "Jormuntide Ignis": "Quivern",
    "Suzaku": "Beakon",
    "Suzaku Aqua": "Beakon",
    "Grizzbolt": "Mammorest",
    "Lyleen": "Reptyro",
    "Lyleen Noct": "Mammorest",
    "Faleris": "Ragnahawk",
    "Orserk": "Menasting",
    "Shadowbeak": "Beakon",
    "Paladius": "Beakon",
    "Necromus": "Beakon",
    "Frostallion": "Menasting",
    "Frostallion Noct": "Menasting",
    "Jetragon": "Beakon"
  },
  "Woolipop": {
    "Lamball": "Fuack",
    "Cattiva": "Bristla",
    "Chikipi": "Tocotoco",
    "Lifmunk": "Ribunny",
    "Foxparks": "Killamari",
    "Fuack": "Kelpsea",
    "Sparkit": "Swee",
    "Tanzee": "Fuddler",
    "Rooby": "Nox",
    "Pengullet": "Kelpsea Ignis",
    "Penking": "Digtoise",
    "Jolthog": "Flopie",
    "Jolthog Cryst": "Kelpsea Ignis",
    "Gumoss": "Dazzi",
    "Gumoss (Special)": "Dazzi",
    "Vixy": "Bristla",
    "Hoocrates": "Killamari",
    "Teafant": "Tocotoco",
    "Depresso": "Killamari",
    "Cremis": "Bristla",
    "Daedream": "Dazzi",
    "Rushoar": "Wixen",
    "Nox": "Woolipop",
    "Fuddler": "Dazzi",
    "Killamari": "Gumoss",
    "Mau": "Tocotoco",
    "Mau Cryst": "Bristla",
    "Celaray": "Galeclaw",
    "Direhowl": "Rushoar",
    "Tocotoco": "Kelpsea",
    "Flopie": "Daedream",
    "Mozzarina": "Vaelet",
    "Bristla": "Kelpsea",
    "Gobfin": "Rushoar",
    "Gobfin Ignis": "Maraith",
    "Hangyu": "Swee",
    "Hangyu Cryst": "Ribunny",
    "Mossanda": "Dinossom",
    "Mossanda Lux": "Arsox",
    "Woolipop": "Woolipop",
    "Caprity": "Direhowl",
    "Melpaca": "Gorirat",
    "Eikthyrdeer": "Direhowl",
    "Eikthyrdeer Terra": "Gorirat",
    "Nitewing": "Chillet",
    "Ribunny": "Tanzee",
    "Incineram": "Melpaca",
    "Incineram Noct": "Melpaca",
    "Cinnamoth": "Digtoise",
    "Arsox": "Verdash",
    "Dumud": "Gorirat",
    "Cawgnito": "Rushoar",
    "Leezpunk": "Rooby",
    "Leezpunk Ignis": "Wixen",
    "Loupmoon": "Beegarde",
    "Galeclaw": "Lunaris",
    "Robinquill": "Lunaris",
    "Robinquill Terra": "Gobfin",
    "Gorirat": "Lunaris",
    "Beegarde": "Rushoar",
    "Elizabee": "Foxcicle",
    "Grintale": "Digtoise",
    "Swee": "Tanzee",
    "Sweepa": "Chillet",
    "Chillet": "Verdash",
    "Univolt": "Caprity",
    "Foxcicle": "Fenglope",
    "Pyrin": "Petallia",
    "Pyrin Noct": "Blazehowl",
    "Reindrix": "Galeclaw",
    "Rayhound": "Loupmoon",
    "Kitsun": "Felbat",
    "Dazzi": "Dazzi",
    "Lunaris": "Maraith",
    "Dinossom": "Felbat",
    "Dinossom Lux": "Felbat",
    "Surfent": "Reindrix",
    "Surfent Terra": "Celaray",
    "Maraith": "Wixen",
    "Digtoise": "Robinquill",
    "Tombat": "Fenglope",
    "Lovander": "Direhowl",
    "Flambelle": "Swee",
    "Vanwyrm": "Eikthyrdeer",
    "Vanwyrm Cryst": "Mozzarina",
    "Bushi": "Eikthyrdeer",
    "Beakon": "Blazehowl",
    "Ragnahawk": "Arsox",
    "Katress": "Loupmoon",
    "Wixen": "Nox",
    "Verdash": "Gobfin",
    "Vaelet": "Leezpunk",
    "Sibelyx": "Dinossom",
    "Elphidran": "Broncherry",
    "Elphidran Aqua": "Broncherry",
    "Kelpsea": "Fuddler",
    "Kelpsea Ignis": "Daedream",
    "Azurobe": "Digtoise",
    "Cryolinx": "Vanwyrm",
    "Blazehowl": "Loupmoon",
    "Blazehowl Noct": "Caprity",
    "Relaxaurus": "Rayhound",
    "Relaxaurus Lux": "Rayhound",
    "Broncherry": "Galeclaw",
    "Broncherry Aqua": "Robinquill",
    "Petallia": "Fenglope",
    "Reptyro": "Tombat",
    "Ice Reptyro": "Blazehowl",
    "Kingpaca": "Kitsun",
    "Ice Kingpaca": "Dinossom",
    "Mammorest": "Tombat",
    "Mammorest Cryst": "Rayhound",
    "Wumpo": "Kitsun",
    "Wumpo Botan": "Kitsun",
    "Warsect": "Foxcicle",
    "Fenglope": "Gobfin",
    "Felbat": "Lunaris",
    "Quivern": "Foxcicle",
    "Blazamut": "Incineram",
    "Helzephyr": "Univolt",
    "Astegon": "Univolt",
    "Menasting": "Rayhound",
    "Anubis": "Reindrix",
    "Jormuntide": "Tombat",
    "Jormuntide Ignis": "Tombat",
    "Suzaku": "Bushi",
    "Suzaku Aqua": "Incineram",
    "Grizzbolt": "Katress",
    "Lyleen": "Blazehowl",
    "Lyleen Noct": "Katress",
    "Faleris": "Petallia",
    "Orserk": "Vanwyrm",
    "Shadowbeak": "Bushi",
    "Paladius": "Bushi",
    "Necromus": "Bushi",
    "Frostallion": "Vanwyrm",
    "Frostallion Noct": "Bushi",
    "Jetragon": "Bushi"
  },
  "Caprity": {
    "Lamball": "Dazzi",
    "Cattiva": "Woolipop",
    "Chikipi": "Dazzi",
    "Lifmunk": "Nox",
    "Foxparks": "Wixen",
    "Fuack": "Rushoar",
    "Sparkit": "Wixen",
    "Tanzee": "Gobfin",
    "Rooby": "Gorirat",
    "Pengullet": "Rushoar",
    "Penking": "Rayhound",
    "Jolthog": "Maraith",
    "Jolthog Cryst": "Maraith",
    "Gumoss": "Gobfin",
    "Gumoss (Special)": "Gobfin",
    "Vixy": "Woolipop",
    "Hoocrates": "Wixen",
    "Teafant": "Dazzi",
    "Depresso": "Rooby",
    "Cremis": "Woolipop",
    "Daedream": "Cawgnito",
    "Rushoar": "Galeclaw",
    "Nox": "Direhowl",
    "Fuddler": "Cawgnito",
    "Killamari": "Lunaris",
    "Mau": "Dazzi",
    "Mau Cryst": "Woolipop",
    "Celaray": "Dumud",
    "Direhowl": "Verdash",
    "Tocotoco": "Rushoar",
    "Flopie": "Lunaris",
    "Mozzarina": "Eikthyrdeer",
    "Bristla": "Rushoar",
    "Gobfin": "Felbat",
    "Gobfin Ignis": "Robinquill",
    "Hangyu": "Nox",
    "Hangyu Cryst": "Nox",
    "Mossanda": "Univolt",
    "Mossanda Lux": "Vanwyrm",
    "Woolipop": "Direhowl",
    "Caprity": "Caprity",
    "Melpaca": "Mozzarina",
    "Eikthyrdeer": "Eikthyrdeer",
    "Eikthyrdeer Terra": "Eikthyrdeer",
    "Nitewing": "Univolt",
    "Ribunny": "Leezpunk",
    "Incineram": "Foxcicle",
    "Incineram Noct": "Tombat",
    "Cinnamoth": "Blazehowl",
    "Arsox": "Broncherry",
    "Dumud": "Mozzarina",
    "Cawgnito": "Felbat",
    "Leezpunk": "Galeclaw",
    "Leezpunk Ignis": "Galeclaw",
    "Loupmoon": "Lovander",
    "Galeclaw": "Fenglope",
    "Robinquill": "Fenglope",
    "Robinquill Terra": "Loupmoon",
    "Gorirat": "Fenglope",
    "Beegarde": "Felbat",
    "Elizabee": "Bushi",
    "Grintale": "Blazehowl",
    "Swee": "Lunaris",
    "Sweepa": "Univolt",
    "Chillet": "Broncherry",
    "Univolt": "Chillet",
    "Foxcicle": "Digtoise",
    "Pyrin": "Bushi",
    "Pyrin Noct": "Incineram",
    "Reindrix": "Mozzarina",
    "Rayhound": "Kitsun",
    "Kitsun": "Reindrix",
    "Dazzi": "Beegarde",
    "Lunaris": "Robinquill",
    "Dinossom": "Reindrix",
    "Dinossom Lux": "Celaray",
    "Surfent": "Tombat",
    "Surfent Terra": "Rayhound",
    "Maraith": "Gorirat",
    "Digtoise": "Melpaca",
    "Tombat": "Digtoise",
    "Lovander": "Caprity",
    "Flambelle": "Wixen",
    "Vanwyrm": "Arsox",
    "Vanwyrm Cryst": "Petallia",
    "Bushi": "Arsox",
    "Beakon": "Anubis",
    "Ragnahawk": "Vanwyrm",
    "Katress": "Dinossom",
    "Wixen": "Gorirat",
    "Verdash": "Loupmoon",
    "Vaelet": "Verdash",
    "Sibelyx": "Univolt",
    "Elphidran": "Rayhound",
    "Elphidran Aqua": "Rayhound",
    "Kelpsea": "Gobfin",
    "Kelpsea Ignis": "Lunaris",
    "Azurobe": "Blazehowl",
    "Cryolinx": "Elphidran",
    "Blazehowl": "Dinossom",
    "Blazehowl Noct": "Chillet",
    "Relaxaurus": "Incineram",
    "Relaxaurus Lux": "Incineram",
    "Broncherry": "Dumud",
    "Broncherry Aqua": "Melpaca",
    "Petallia": "Digtoise",
    "Reptyro": "Bushi",
    "Ice Reptyro": "Anubis",
    "Kingpaca": "Katress",
    "Ice Kingpaca": "Univolt",
    "Mammorest": "Incineram",
    "Mammorest Cryst": "Incineram",
    "Wumpo": "Katress",
    "Wumpo Botan": "Blazehowl",
    "Warsect": "Bushi",
    "Fenglope": "Loupmoon",
    "Felbat": "Fenglope",
    "Quivern": "Bushi",
    "Blazamut": "Kingpaca",
    "Helzephyr": "Surfent",
    "Astegon": "Elphidran",
    "Menasting": "Incineram",
    "Anubis": "Tombat",
    "Jormuntide": "Bushi",
    "Jormuntide Ignis": "Bushi",
    "Suzaku": "Cinnamoth",
    "Suzaku Aqua": "Wumpo Botan",
    "Grizzbolt": "Anubis",
    "Lyleen": "Incineram",
    "Lyleen Noct": "Anubis",
    "Faleris": "Vanwyrm",
    "Orserk": "Elphidran",
    "Shadowbeak": "Azurobe",
    "Paladius": "Azurobe",
    "Necromus": "Azurobe",
    "Frostallion": "Penking",
    "Frostallion Noct": "Penking",
    "Jetragon": "Grintale"
  },
  "Melpaca": {
    "Lamball": "Nox",
    "Cattiva": "Nox",
    "Chikipi": "Woolipop",
    "Lifmunk": "Wixen",
    "Foxparks": "Maraith",
    "Fuack": "Lunaris",
    "Sparkit": "Maraith",
    "Tanzee": "Beegarde",
    "Rooby": "Robinquill",
    "Pengullet": "Leezpunk",
    "Penking": "Blazehowl",
    "Jolthog": "Rushoar",
    "Jolthog Cryst": "Rushoar",
    "Gumoss": "Direhowl",
    "Gumoss (Special)": "Direhowl",
    "Vixy": "Wixen",
    "Hoocrates": "Rushoar",
    "Teafant": "Woolipop",
    "Depresso": "Rushoar",
    "Cremis": "Nox",
    "Daedream": "Direhowl",
    "Rushoar": "Felbat",
    "Nox": "Galeclaw",
    "Fuddler": "Direhowl",
    "Killamari": "Gobfin",
    "Mau": "Woolipop",
    "Mau Cryst": "Wixen",
    "Celaray": "Reindrix",
    "Direhowl": "Fenglope",
    "Tocotoco": "Lunaris",
    "Flopie": "Gobfin",
    "Mozzarina": "Dumud",
    "Bristla": "Lunaris",
    "Gobfin": "Verdash",
    "Gobfin Ignis": "Verdash",
    "Hangyu": "Rooby",
    "Hangyu Cryst": "Rooby",
    "Mossanda": "Vanwyrm",
    "Mossanda Lux": "Bushi",
    "Woolipop": "Gorirat",
    "Caprity": "Mozzarina",
    "Melpaca": "Melpaca",
    "Eikthyrdeer": "Mozzarina",
    "Eikthyrdeer Terra": "Dumud",
    "Nitewing": "Vanwyrm",
    "Ribunny": "Lunaris",
    "Incineram": "Rayhound",
    "Incineram Noct": "Rayhound",
    "Cinnamoth": "Univolt",
    "Arsox": "Digtoise",
    "Dumud": "Dumud",
    "Cawgnito": "Fenglope",
    "Leezpunk": "Felbat",
    "Leezpunk Ignis": "Robinquill",
    "Loupmoon": "Eikthyrdeer",
    "Galeclaw": "Loupmoon",
    "Robinquill": "Loupmoon",
    "Robinquill Terra": "Loupmoon",
    "Gorirat": "Loupmoon",
    "Beegarde": "Fenglope",
    "Elizabee": "Incineram",
    "Grintale": "Katress",
    "Swee": "Gobfin",
    "Sweepa": "Vanwyrm",
    "Chillet": "Digtoise",
    "Univolt": "Arsox",
    "Foxcicle": "Kitsun",
    "Pyrin": "Bushi",
    "Pyrin Noct": "Anubis",
    "Reindrix": "Melpaca",
    "Rayhound": "Dinossom",
    "Kitsun": "Broncherry",
    "Dazzi": "Vaelet",
    "Lunaris": "Felbat",
    "Dinossom": "Digtoise",
    "Dinossom Lux": "Digtoise",
    "Surfent": "Rayhound",
    "Surfent Terra": "Blazehowl",
    "Maraith": "Robinquill",
    "Digtoise": "Celaray",
    "Tombat": "Dinossom",
    "Lovander": "Eikthyrdeer",
    "Flambelle": "Maraith",
    "Vanwyrm": "Petallia",
    "Vanwyrm Cryst": "Tombat",
    "Bushi": "Foxcicle",
    "Beakon": "Surfent",
    "Ragnahawk": "Bushi",
    "Katress": "Arsox",
    "Wixen": "Galeclaw",
    "Verdash": "Lovander",
    "Vaelet": "Fenglope",
    "Sibelyx": "Univolt",
    "Elphidran": "Blazehowl",
    "Elphidran Aqua": "Blazehowl",
    "Kelpsea": "Cawgnito",
    "Kelpsea Ignis": "Cawgnito",
    "Azurobe": "Katress",
    "Cryolinx": "Grintale",
    "Blazehowl": "Chillet",
    "Blazehowl Noct": "Petallia",
    "Relaxaurus": "Incineram",
    "Relaxaurus Lux": "Anubis",
    "Broncherry": "Reindrix",
    "Broncherry Aqua": "Broncherry",
    "Petallia": "Kitsun",
    "Reptyro": "Incineram",
    "Ice Reptyro": "Surfent",
    "Kingpaca": "Univolt",
    "Ice Kingpaca": "Vanwyrm",
    "Mammorest": "Incineram",
    "Mammorest Cryst": "Incineram",
    "Wumpo": "Univolt",
    "Wumpo Botan": "Univolt",
    "Warsect": "Incineram",
    "Fenglope": "Caprity",
    "Felbat": "Loupmoon",
    "Quivern": "Bushi",
    "Blazamut": "Sibelyx",
    "Helzephyr": "Elphidran",
    "Astegon": "Penking",
    "Menasting": "Anubis",
    "Anubis": "Rayhound",
    "Jormuntide": "Incineram",
    "Jormuntide Ignis": "Incineram",
    "Suzaku": "Kingpaca",
    "Suzaku Aqua": "Wumpo",
    "Grizzbolt": "Elphidran",
    "Lyleen": "Anubis",
    "Lyleen Noct": "Elphidran",
    "Faleris": "Bushi",
    "Orserk": "Penking",
    "Shadowbeak": "Wumpo Botan",
    "Paladius": "Wumpo Botan",
    "Necromus": "Wumpo Botan",
    "Frostallion": "Azurobe",
    "Frostallion Noct": "Azurobe",
    "Jetragon": "Cinnamoth"
  },
  "Eikthyrdeer": {
    "Lamball": "Woolipop",
    "Cattiva": "Woolipop",
    "Chikipi": "Dazzi",
    "Lifmunk": "Nox",
    "Foxparks": "Wixen",
    "Fuack": "Rushoar",
    "Sparkit": "Wixen",
    "Tanzee": "Gobfin",
    "Rooby": "Gorirat",
    "Pengullet": "Rushoar",
    "Penking": "Blazehowl",
    "Jolthog": "Maraith",
    "Jolthog Cryst": "Rushoar",
    "Gumoss": "Cawgnito",
    "Gumoss (Special)": "Cawgnito",
    "Vixy": "Woolipop",
    "Hoocrates": "Rooby",
    "Teafant": "Dazzi",
    "Depresso": "Maraith",
    "Cremis": "Woolipop",
    "Daedream": "Cawgnito",
    "Rushoar": "Galeclaw",
    "Nox": "Vaelet",
    "Fuddler": "Beegarde",
    "Killamari": "Lunaris",
    "Mau": "Dazzi",
    "Mau Cryst": "Nox",
    "Celaray": "Dumud",
    "Direhowl": "Verdash",
    "Tocotoco": "Rushoar",
    "Flopie": "Lunaris",
    "Mozzarina": "Eikthyrdeer",
    "Bristla": "Leezpunk",
    "Gobfin": "Felbat",
    "Gobfin Ignis": "Felbat",
    "Hangyu": "Eikthyrdeer Terra",
    "Hangyu Cryst": "Nox",
    "Mossanda": "Univolt",
    "Mossanda Lux": "Vanwyrm",
    "Woolipop": "Direhowl",
    "Caprity": "Eikthyrdeer",
    "Melpaca": "Mozzarina",
    "Eikthyrdeer": "Eikthyrdeer",
    "Eikthyrdeer Terra": "Mozzarina",
    "Nitewing": "Univolt",
    "Ribunny": "Lunaris",
    "Incineram": "Tombat",
    "Incineram Noct": "Tombat",
    "Cinnamoth": "Blazehowl",
    "Arsox": "Digtoise",
    "Dumud": "Mozzarina",
    "Cawgnito": "Felbat",
    "Leezpunk": "Robinquill",
    "Leezpunk Ignis": "Galeclaw",
    "Loupmoon": "Caprity",
    "Galeclaw": "Fenglope",
    "Robinquill": "Fenglope",
    "Robinquill Terra": "Loupmoon",
    "Gorirat": "Fenglope",
    "Beegarde": "Verdash",
    "Elizabee": "Bushi",
    "Grintale": "Blazehowl",
    "Swee": "Lunaris",
    "Sweepa": "Vanwyrm",
    "Chillet": "Broncherry",
    "Univolt": "Chillet",
    "Foxcicle": "Digtoise",
    "Pyrin": "Bushi",
    "Pyrin Noct": "Anubis",
    "Reindrix": "Dumud",
    "Rayhound": "Kitsun",
    "Kitsun": "Reindrix",
    "Dazzi": "Direhowl",
    "Lunaris": "Robinquill",
    "Dinossom": "Celaray",
    "Dinossom Lux": "Broncherry",
    "Surfent": "Rayhound",
    "Surfent Terra": "Rayhound",
    "Maraith": "Galeclaw",
    "Digtoise": "Melpaca",
    "Tombat": "Kitsun",
    "Lovander": "Caprity",
    "Flambelle": "Wixen",
    "Vanwyrm": "Arsox",
    "Vanwyrm Cryst": "Foxcicle",
    "Bushi": "Petallia",
    "Beakon": "Anubis",
    "Ragnahawk": "Vanwyrm",
    "Katress": "Dinossom",
    "Wixen": "Gorirat",
    "Verdash": "Loupmoon",
    "Vaelet": "Fenglope",
    "Sibelyx": "Univolt",
    "Elphidran": "Rayhound",
    "Elphidran Aqua": "Rayhound",
    "Kelpsea": "Gobfin",
    "Kelpsea Ignis": "Gobfin",
    "Azurobe": "Blazehowl",
    "Cryolinx": "Penking",
    "Blazehowl": "Dinossom",
    "Blazehowl Noct": "Arsox",
    "Relaxaurus": "Incineram",
    "Relaxaurus Lux": "Incineram",
    "Broncherry": "Melpaca",
    "Broncherry Aqua": "Reindrix",
    "Petallia": "Digtoise",
    "Reptyro": "Bushi",
    "Ice Reptyro": "Anubis",
    "Kingpaca": "Katress",
    "Ice Kingpaca": "Univolt",
    "Mammorest": "Incineram",
    "Mammorest Cryst": "Incineram",
    "Wumpo": "Univolt",
    "Wumpo Botan": "Katress",
    "Warsect": "Bushi",
    "Fenglope": "Loupmoon",
    "Felbat": "Loupmoon",
    "Quivern": "Bushi",
    "Blazamut": "Wumpo",
    "Helzephyr": "Surfent",
    "Astegon": "Elphidran",
    "Menasting": "Incineram",
    "Anubis": "Tombat",
    "Jormuntide": "Incineram",
    "Jormuntide Ignis": "Bushi",
    "Suzaku": "Wumpo Botan",
    "Suzaku Aqua": "Wumpo Botan",
    "Grizzbolt": "Surfent",
    "Lyleen": "Incineram",
    "Lyleen Noct": "Anubis",
    "Faleris": "Bushi",
    "Orserk": "Elphidran",
    "Shadowbeak": "Cinnamoth",
    "Paladius": "Azurobe",
    "Necromus": "Azurobe",
    "Frostallion": "Penking",
    "Frostallion Noct": "Grintale",
    "Jetragon": "Azurobe"
  },
  "Eikthyrdeer Terra": {
    "variant": true,
    "Lamball": "Woolipop",
    "Cattiva": "Nox",
    "Chikipi": "Dazzi",
    "Lifmunk": "Wixen",
    "Foxparks": "Maraith",
    "Fuack": "Lunaris",
    "Sparkit": "Rooby",
    "Tanzee": "Cawgnito",
    "Rooby": "Galeclaw",
    "Pengullet": "Rushoar",
    "Penking": "Blazehowl",
    "Jolthog": "Rushoar",
    "Jolthog Cryst": "Rushoar",
    "Gumoss": "Beegarde",
    "Gumoss (Special)": "Beegarde",
    "Vixy": "Nox",
    "Hoocrates": "Maraith",
    "Teafant": "Woolipop",
    "Depresso": "Rushoar",
    "Cremis": "Nox",
    "Daedream": "Direhowl",
    "Rushoar": "Robinquill",
    "Nox": "Gorirat",
    "Fuddler": "Direhowl",
    "Killamari": "Gobfin",
    "Mau": "Woolipop",
    "Mau Cryst": "Wixen",
    "Celaray": "Melpaca",
    "Direhowl": "Fenglope",
    "Tocotoco": "Leezpunk",
    "Flopie": "Gobfin",
    "Mozzarina": "Mozzarina",
    "Bristla": "Lunaris",
    "Gobfin": "Verdash",
    "Gobfin Ignis": "Felbat",
    "Hangyu": "Wixen",
    "Hangyu Cryst": "Wixen",
    "Mossanda": "Vanwyrm",
    "Mossanda Lux": "Bushi",
    "Woolipop": "Gorirat",
    "Caprity": "Eikthyrdeer",
    "Melpaca": "Dumud",
    "Eikthyrdeer": "Mozzarina",
    "Eikthyrdeer Terra": "Eikthyrdeer Terra",
    "Nitewing": "Vanwyrm",
    "Ribunny": "Lunaris",
    "Incineram": "Tombat",
    "Incineram Noct": "Rayhound",
    "Cinnamoth": "Katress",
    "Arsox": "Digtoise",
    "Dumud": "Dumud",
    "Cawgnito": "Verdash",
    "Leezpunk": "Felbat",
    "Leezpunk Ignis": "Robinquill",
    "Loupmoon": "Eikthyrdeer",
    "Galeclaw": "Loupmoon",
    "Robinquill": "Loupmoon",
    "Robinquill Terra": "Loupmoon",
    "Gorirat": "Fenglope",
    "Beegarde": "Fenglope",
    "Elizabee": "Incineram",
    "Grintale": "Blazehowl",
    "Swee": "Lunaris",
    "Sweepa": "Vanwyrm",
    "Chillet": "Digtoise",
    "Univolt": "Arsox",
    "Foxcicle": "Kitsun",
    "Pyrin": "Bushi",
    "Pyrin Noct": "Anubis",
    "Reindrix": "Melpaca",
    "Rayhound": "Dinossom",
    "Kitsun": "Broncherry",
    "Dazzi": "Direhowl",
    "Lunaris": "Felbat",
    "Dinossom": "Broncherry",
    "Dinossom Lux": "Digtoise",
    "Surfent": "Rayhound",
    "Surfent Terra": "Rayhound",
    "Maraith": "Galeclaw",
    "Digtoise": "Reindrix",
    "Tombat": "Kitsun",
    "Lovander": "Eikthyrdeer",
    "Flambelle": "Rooby",
    "Vanwyrm": "Petallia",
    "Vanwyrm Cryst": "Foxcicle",
    "Bushi": "Foxcicle",
    "Beakon": "Surfent",
    "Ragnahawk": "Bushi",
    "Katress": "Chillet",
    "Wixen": "Galeclaw",
    "Verdash": "Loupmoon",
    "Vaelet": "Fenglope",
    "Sibelyx": "Univolt",
    "Elphidran": "Blazehowl",
    "Elphidran Aqua": "Blazehowl",
    "Kelpsea": "Cawgnito",
    "Kelpsea Ignis": "Gobfin",
    "Azurobe": "Katress",
    "Cryolinx": "Penking",
    "Blazehowl": "Chillet",
    "Blazehowl Noct": "Arsox",
    "Relaxaurus": "Incineram",
    "Relaxaurus Lux": "Incineram",
    "Broncherry": "Reindrix",
    "Broncherry Aqua": "Celaray",
    "Petallia": "Digtoise",
    "Reptyro": "Incineram",
    "Ice Reptyro": "Anubis",
    "Kingpaca": "Univolt",
    "Ice Kingpaca": "Univolt",
    "Mammorest": "Incineram",
    "Mammorest Cryst": "Incineram",
    "Wumpo": "Univolt",
    "Wumpo Botan": "Univolt",
    "Warsect": "Bushi",
    "Fenglope": "Lovander",
    "Felbat": "Loupmoon",
    "Quivern": "Bushi",
    "Blazamut": "Sibelyx",
    "Helzephyr": "Elphidran",
    "Astegon": "Penking",
    "Menasting": "Anubis",
    "Anubis": "Rayhound",
    "Jormuntide": "Incineram",
    "Jormuntide Ignis": "Incineram",
    "Suzaku": "Wumpo Botan",
    "Suzaku Aqua": "Wumpo",
    "Grizzbolt": "Elphidran",
    "Lyleen": "Anubis",
    "Lyleen Noct": "Surfent",
    "Faleris": "Bushi",
    "Orserk": "Penking",
    "Shadowbeak": "Wumpo Botan",
    "Paladius": "Cinnamoth",
    "Necromus": "Wumpo Botan",
    "Frostallion": "Grintale",
    "Frostallion Noct": "Azurobe",
    "Jetragon": "Azurobe"
  },
  "Nitewing": {
    "Lamball": "Loupmoon",
    "Cattiva": "Lovander",
    "Chikipi": "Loupmoon",
    "Lifmunk": "Eikthyrdeer",
    "Foxparks": "Mozzarina",
    "Fuack": "Reindrix",
    "Sparkit": "Eikthyrdeer",
    "Tanzee": "Kitsun",
    "Rooby": "Arsox",
    "Pengullet": "Melpaca",
    "Penking": "Kingpaca",
    "Jolthog": "Dumud",
    "Jolthog Cryst": "Melpaca",
    "Gumoss": "Kitsun",
    "Gumoss (Special)": "Kitsun",
    "Vixy": "Caprity",
    "Hoocrates": "Mozzarina",
    "Teafant": "Loupmoon",
    "Depresso": "Dumud",
    "Cremis": "Lovander",
    "Daedream": "Kitsun",
    "Rushoar": "Petallia",
    "Nox": "Chillet",
    "Fuddler": "Dinossom",
    "Killamari": "Digtoise",
    "Mau": "Loupmoon",
    "Mau Cryst": "Caprity",
    "Celaray": "Bushi",
    "Direhowl": "Rayhound",
    "Tocotoco": "Reindrix",
    "Flopie": "Digtoise",
    "Mozzarina": "Vanwyrm",
    "Bristla": "Celaray",
    "Gobfin": "Tombat",
    "Gobfin Ignis": "Foxcicle",
    "Hangyu": "Eikthyrdeer",
    "Hangyu Cryst": "Eikthyrdeer",
    "Mossanda": "Nitewing",
    "Mossanda Lux": "Sweepa",
    "Woolipop": "Chillet",
    "Caprity": "Univolt",
    "Melpaca": "Vanwyrm",
    "Eikthyrdeer": "Univolt",
    "Eikthyrdeer Terra": "Vanwyrm",
    "Nitewing": "Nitewing",
    "Ribunny": "Broncherry",
    "Incineram": "Azurobe",
    "Incineram Noct": "Azurobe",
    "Cinnamoth": "Sibelyx",
    "Arsox": "Incineram",
    "Dumud": "Vanwyrm",
    "Cawgnito": "Tombat",
    "Leezpunk": "Foxcicle",
    "Leezpunk Ignis": "Petallia",
    "Loupmoon": "Univolt",
    "Galeclaw": "Rayhound",
    "Robinquill": "Blazehowl",
    "Robinquill Terra": "Blazehowl",
    "Gorirat": "Rayhound",
    "Beegarde": "Tombat",
    "Elizabee": "Ragnahawk",
    "Grintale": "Wumpo",
    "Swee": "Broncherry",
    "Sweepa": "Nitewing",
    "Chillet": "Incineram",
    "Univolt": "Elphidran",
    "Foxcicle": "Incineram",
    "Pyrin": "Ragnahawk",
    "Pyrin Noct": "Elizabee",
    "Reindrix": "Vanwyrm",
    "Rayhound": "Anubis",
    "Kitsun": "Bushi",
    "Dazzi": "Dinossom",
    "Lunaris": "Foxcicle",
    "Dinossom": "Bushi",
    "Dinossom Lux": "Incineram",
    "Surfent": "Cinnamoth",
    "Surfent Terra": "Wumpo Botan",
    "Maraith": "Arsox",
    "Digtoise": "Bushi",
    "Tombat": "Incineram",
    "Lovander": "Univolt",
    "Flambelle": "Mozzarina",
    "Vanwyrm": "Elphidran",
    "Vanwyrm Cryst": "Penking",
    "Bushi": "Elphidran",
    "Beakon": "Reptyro",
    "Ragnahawk": "Sweepa",
    "Katress": "Surfent",
    "Wixen": "Arsox",
    "Verdash": "Blazehowl",
    "Vaelet": "Rayhound",
    "Sibelyx": "Mossanda",
    "Elphidran": "Wumpo Botan",
    "Elphidran Aqua": "Wumpo Botan",
    "Kelpsea": "Digtoise",
    "Kelpsea Ignis": "Digtoise",
    "Azurobe": "Wumpo",
    "Cryolinx": "Relaxaurus",
    "Blazehowl": "Anubis",
    "Blazehowl Noct": "Elphidran",
    "Relaxaurus": "Quivern",
    "Relaxaurus Lux": "Warsect",
    "Broncherry": "Bushi",
    "Broncherry Aqua": "Bushi",
    "Petallia": "Incineram",
    "Reptyro": "Pyrin",
    "Ice Reptyro": "Reptyro",
    "Kingpaca": "Sibelyx",
    "Ice Kingpaca": "Mossanda",
    "Mammorest": "Pyrin",
    "Mammorest Cryst": "Pyrin",
    "Wumpo": "Sibelyx",
    "Wumpo Botan": "Sibelyx",
    "Warsect": "Ragnahawk",
    "Fenglope": "Katress",
    "Felbat": "Blazehowl",
    "Quivern": "Ragnahawk",
    "Blazamut": "Beakon",
    "Helzephyr": "Jormuntide",
    "Astegon": "Relaxaurus",
    "Menasting": "Warsect",
    "Anubis": "Azurobe",
    "Jormuntide": "Pyrin",
    "Jormuntide Ignis": "Pyrin",
    "Suzaku": "Beakon",
    "Suzaku Aqua": "Beakon",
    "Grizzbolt": "Jormuntide",
    "Lyleen": "Elizabee",
    "Lyleen Noct": "Jormuntide",
    "Faleris": "Sweepa",
    "Orserk": "Relaxaurus",
    "Shadowbeak": "Beakon",
    "Paladius": "Menasting",
    "Necromus": "Menasting",
    "Frostallion": "Relaxaurus",
    "Frostallion Noct": "Menasting",
    "Jetragon": "Menasting"
  },
  "Ribunny": {
    "Lamball": "Hoocrates",
    "Cattiva": "Depresso",
    "Chikipi": "Flambelle",
    "Lifmunk": "Jolthog",
    "Foxparks": "Pengullet",
    "Fuack": "Bristla",
    "Sparkit": "Jolthog",
    "Tanzee": "Flopie",
    "Rooby": "Daedream",
    "Pengullet": "Fuack",
    "Penking": "Eikthyrdeer",
    "Jolthog": "Tocotoco",
    "Jolthog Cryst": "Tocotoco",
    "Gumoss": "Kelpsea Ignis",
    "Gumoss (Special)": "Kelpsea Ignis",
    "Vixy": "Depresso",
    "Hoocrates": "Pengullet",
    "Teafant": "Foxparks",
    "Depresso": "Tocotoco",
    "Cremis": "Depresso",
    "Daedream": "Kelpsea Ignis",
    "Rushoar": "Fuddler",
    "Nox": "Tanzee",
    "Fuddler": "Kelpsea",
    "Killamari": "Swee",
    "Mau": "Foxparks",
    "Mau Cryst": "Jolthog",
    "Celaray": "Gobfin",
    "Direhowl": "Woolipop",
    "Tocotoco": "Bristla",
    "Flopie": "Killamari",
    "Mozzarina": "Lunaris",
    "Bristla": "Bristla",
    "Gobfin": "Dazzi",
    "Gobfin Ignis": "Dazzi",
    "Hangyu": "Jolthog",
    "Hangyu Cryst": "Jolthog",
    "Mossanda": "Celaray",
    "Mossanda Lux": "Digtoise",
    "Woolipop": "Tanzee",
    "Caprity": "Leezpunk",
    "Melpaca": "Lunaris",
    "Eikthyrdeer": "Lunaris",
    "Eikthyrdeer Terra": "Lunaris",
    "Nitewing": "Broncherry",
    "Ribunny": "Ribunny",
    "Incineram": "Loupmoon",
    "Incineram Noct": "Loupmoon",
    "Cinnamoth": "Dumud",
    "Arsox": "Vaelet",
    "Dumud": "Lunaris",
    "Cawgnito": "Woolipop",
    "Leezpunk": "Dazzi",
    "Leezpunk Ignis": "Fuddler",
    "Loupmoon": "Rushoar",
    "Galeclaw": "Wixen",
    "Robinquill": "Wixen",
    "Robinquill Terra": "Rooby",
    "Gorirat": "Nox",
    "Beegarde": "Woolipop",
    "Elizabee": "Dinossom",
    "Grintale": "Mozzarina",
    "Swee": "Swee",
    "Sweepa": "Broncherry",
    "Chillet": "Direhowl",
    "Univolt": "Verdash",
    "Foxcicle": "Galeclaw",
    "Pyrin": "Kitsun",
    "Pyrin Noct": "Petallia",
    "Reindrix": "Gobfin",
    "Rayhound": "Galeclaw",
    "Kitsun": "Beegarde",
    "Dazzi": "Kelpsea",
    "Lunaris": "Dazzi",
    "Dinossom": "Direhowl",
    "Dinossom Lux": "Direhowl",
    "Surfent": "Caprity",
    "Surfent Terra": "Caprity",
    "Maraith": "Daedream",
    "Digtoise": "Cawgnito",
    "Tombat": "Galeclaw",
    "Lovander": "Rushoar",
    "Flambelle": "Pengullet",
    "Vanwyrm": "Fenglope",
    "Vanwyrm Cryst": "Loupmoon",
    "Bushi": "Fenglope",
    "Beakon": "Foxcicle",
    "Ragnahawk": "Digtoise",
    "Katress": "Felbat",
    "Wixen": "Daedream",
    "Verdash": "Maraith",
    "Vaelet": "Nox",
    "Sibelyx": "Reindrix",
    "Elphidran": "Eikthyrdeer",
    "Elphidran Aqua": "Eikthyrdeer",
    "Kelpsea": "Killamari",
    "Kelpsea Ignis": "Killamari",
    "Azurobe": "Mozzarina",
    "Cryolinx": "Blazehowl",
    "Blazehowl": "Felbat",
    "Blazehowl Noct": "Verdash",
    "Relaxaurus": "Arsox",
    "Relaxaurus Lux": "Arsox",
    "Broncherry": "Gobfin",
    "Broncherry Aqua": "Cawgnito",
    "Petallia": "Gorirat",
    "Reptyro": "Dinossom",
    "Ice Reptyro": "Foxcicle",
    "Kingpaca": "Melpaca",
    "Ice Kingpaca": "Reindrix",
    "Mammorest": "Chillet",
    "Mammorest Cryst": "Chillet",
    "Wumpo": "Melpaca",
    "Wumpo Botan": "Dumud",
    "Warsect": "Kitsun",
    "Fenglope": "Maraith",
    "Felbat": "Wixen",
    "Quivern": "Kitsun",
    "Blazamut": "Vanwyrm",
    "Helzephyr": "Tombat",
    "Astegon": "Rayhound",
    "Menasting": "Arsox",
    "Anubis": "Lovander",
    "Jormuntide": "Dinossom",
    "Jormuntide Ignis": "Dinossom",
    "Suzaku": "Univolt",
    "Suzaku Aqua": "Univolt",
    "Grizzbolt": "Tombat",
    "Lyleen": "Petallia",
    "Lyleen Noct": "Foxcicle",
    "Faleris": "Digtoise",
    "Orserk": "Rayhound",
    "Shadowbeak": "Univolt",
    "Paladius": "Katress",
    "Necromus": "Univolt",
    "Frostallion": "Blazehowl",
    "Frostallion Noct": "Blazehowl",
    "Jetragon": "Katress"
  },
  "Incineram": {
    "Lamball": "Galeclaw",
    "Cattiva": "Galeclaw",
    "Chikipi": "Gorirat",
    "Lifmunk": "Felbat",
    "Foxparks": "Verdash",
    "Fuack": "Loupmoon",
    "Sparkit": "Felbat",
    "Tanzee": "Eikthyrdeer",
    "Rooby": "Celaray",
    "Pengullet": "Fenglope",
    "Penking": "Surfent",
    "Jolthog": "Fenglope",
    "Jolthog Cryst": "Fenglope",
    "Gumoss": "Eikthyrdeer",
    "Gumoss (Special)": "Eikthyrdeer",
    "Vixy": "Robinquill",
    "Hoocrates": "Verdash",
    "Teafant": "Gorirat",
    "Depresso": "Fenglope",
    "Cremis": "Robinquill",
    "Daedream": "Mozzarina",
    "Rushoar": "Broncherry",
    "Nox": "Melpaca",
    "Fuddler": "Mozzarina",
    "Killamari": "Lovander",
    "Mau": "Galeclaw",
    "Mau Cryst": "Robinquill",
    "Celaray": "Rayhound",
    "Direhowl": "Kitsun",
    "Tocotoco": "Loupmoon",
    "Flopie": "Caprity",
    "Mozzarina": "Tombat",
    "Bristla": "Loupmoon",
    "Gobfin": "Digtoise",
    "Gobfin Ignis": "Digtoise",
    "Hangyu": "Felbat",
    "Hangyu Cryst": "Felbat",
    "Mossanda": "Grintale",
    "Mossanda Lux": "Cinnamoth",
    "Woolipop": "Melpaca",
    "Caprity": "Foxcicle",
    "Melpaca": "Rayhound",
    "Eikthyrdeer": "Tombat",
    "Eikthyrdeer Terra": "Tombat",
    "Nitewing": "Azurobe",
    "Ribunny": "Loupmoon",
    "Incineram": "Incineram",
    "Incineram Noct": "Incineram",
    "Cinnamoth": "Elphidran",
    "Arsox": "Univolt",
    "Dumud": "Rayhound",
    "Cawgnito": "Kitsun",
    "Leezpunk": "Digtoise",
    "Leezpunk Ignis": "Broncherry",
    "Loupmoon": "Foxcicle",
    "Galeclaw": "Dinossom",
    "Robinquill": "Chillet",
    "Robinquill Terra": "Arsox",
    "Gorirat": "Dinossom",
    "Beegarde": "Kitsun",
    "Elizabee": "Wumpo",
    "Grintale": "Elphidran",
    "Swee": "Loupmoon",
    "Sweepa": "Azurobe",
    "Chillet": "Katress",
    "Univolt": "Bushi",
    "Foxcicle": "Univolt",
    "Pyrin": "Wumpo Botan",
    "Pyrin Noct": "Nitewing",
    "Reindrix": "Rayhound",
    "Rayhound": "Vanwyrm",
    "Kitsun": "Blazehowl",
    "Dazzi": "Dumud",
    "Lunaris": "Digtoise",
    "Dinossom": "Blazehowl",
    "Dinossom Lux": "Katress",
    "Surfent": "Anubis",
    "Surfent Terra": "Anubis",
    "Maraith": "Incineram Noct",
    "Digtoise": "Blazehowl",
    "Tombat": "Univolt",
    "Lovander": "Foxcicle",
    "Flambelle": "Verdash",
    "Vanwyrm": "Bushi",
    "Vanwyrm Cryst": "Incineram",
    "Bushi": "Incineram",
    "Beakon": "Sweepa",
    "Ragnahawk": "Wumpo Botan",
    "Katress": "Bushi",
    "Wixen": "Reindrix",
    "Verdash": "Arsox",
    "Vaelet": "Dinossom",
    "Sibelyx": "Penking",
    "Elphidran": "Anubis",
    "Elphidran Aqua": "Surfent",
    "Kelpsea": "Eikthyrdeer",
    "Kelpsea Ignis": "Caprity",
    "Azurobe": "Elphidran",
    "Cryolinx": "Pyrin",
    "Blazehowl": "Vanwyrm",
    "Blazehowl Noct": "Bushi",
    "Relaxaurus": "Mossanda",
    "Relaxaurus Lux": "Mossanda",
    "Broncherry": "Rayhound",
    "Broncherry Aqua": "Blazehowl",
    "Petallia": "Univolt",
    "Reptyro": "Sibelyx",
    "Ice Reptyro": "Sweepa",
    "Kingpaca": "Elphidran",
    "Ice Kingpaca": "Penking",
    "Mammorest": "Sibelyx",
    "Mammorest Cryst": "Sibelyx",
    "Wumpo": "Penking",
    "Wumpo Botan": "Elphidran",
    "Warsect": "Wumpo",
    "Fenglope": "Arsox",
    "Felbat": "Chillet",
    "Quivern": "Kingpaca",
    "Blazamut": "Mammorest",
    "Helzephyr": "Ragnahawk",
    "Astegon": "Pyrin",
    "Menasting": "Nitewing",
    "Anubis": "Anubis",
    "Jormuntide": "Sibelyx",
    "Jormuntide Ignis": "Sibelyx",
    "Suzaku": "Reptyro",
    "Suzaku Aqua": "Jormuntide",
    "Grizzbolt": "Sweepa",
    "Lyleen": "Nitewing",
    "Lyleen Noct": "Sweepa",
    "Faleris": "Wumpo Botan",
    "Orserk": "Pyrin",
    "Shadowbeak": "Reptyro",
    "Paladius": "Elizabee",
    "Necromus": "Elizabee",
    "Frostallion": "Pyrin",
    "Frostallion Noct": "Warsect",
    "Jetragon": "Warsect"
  },
  "Incineram Noct": {
    "variant": true,
    "Lamball": "Galeclaw",
    "Cattiva": "Robinquill",
    "Chikipi": "Gorirat",
    "Lifmunk": "Felbat",
    "Foxparks": "Verdash",
    "Fuack": "Loupmoon",
    "Sparkit": "Verdash",
    "Tanzee": "Eikthyrdeer",
    "Rooby": "Celaray",
    "Pengullet": "Loupmoon",
    "Penking": "Elphidran",
    "Jolthog": "Fenglope",
    "Jolthog Cryst": "Fenglope",
    "Gumoss": "Mozzarina",
    "Gumoss (Special)": "Mozzarina",
    "Vixy": "Robinquill",
    "Hoocrates": "Fenglope",
    "Teafant": "Galeclaw",
    "Depresso": "Fenglope",
    "Cremis": "Robinquill",
    "Daedream": "Mozzarina",
    "Rushoar": "Digtoise",
    "Nox": "Reindrix",
    "Fuddler": "Dumud",
    "Killamari": "Caprity",
    "Mau": "Galeclaw",
    "Mau Cryst": "Felbat",
    "Celaray": "Rayhound",
    "Direhowl": "Dinossom",
    "Tocotoco": "Loupmoon",
    "Flopie": "Caprity",
    "Mozzarina": "Tombat",
    "Bristla": "Loupmoon",
    "Gobfin": "Kitsun",
    "Gobfin Ignis": "Digtoise",
    "Hangyu": "Felbat",
    "Hangyu Cryst": "Felbat",
    "Mossanda": "Azurobe",
    "Mossanda Lux": "Wumpo Botan",
    "Woolipop": "Melpaca",
    "Caprity": "Tombat",
    "Melpaca": "Rayhound",
    "Eikthyrdeer": "Tombat",
    "Eikthyrdeer Terra": "Rayhound",
    "Nitewing": "Azurobe",
    "Ribunny": "Loupmoon",
    "Incineram": "Incineram",
    "Incineram Noct": "Incineram Noct",
    "Cinnamoth": "Elphidran",
    "Arsox": "Univolt",
    "Dumud": "Rayhound",
    "Cawgnito": "Kitsun",
    "Leezpunk": "Digtoise",
    "Leezpunk Ignis": "Broncherry",
    "Loupmoon": "Foxcicle",
    "Galeclaw": "Chillet",
    "Robinquill": "Chillet",
    "Robinquill Terra": "Arsox",
    "Gorirat": "Dinossom",
    "Beegarde": "Kitsun",
    "Elizabee": "Sibelyx",
    "Grintale": "Elphidran",
    "Swee": "Lovander",
    "Sweepa": "Azurobe",
    "Chillet": "Univolt",
    "Univolt": "Bushi",
    "Foxcicle": "Univolt",
    "Pyrin": "Kingpaca",
    "Pyrin Noct": "Sweepa",
    "Reindrix": "Rayhound",
    "Rayhound": "Vanwyrm",
    "Kitsun": "Blazehowl",
    "Dazzi": "Dumud",
    "Lunaris": "Digtoise",
    "Dinossom": "Katress",
    "Dinossom Lux": "Katress",
    "Surfent": "Anubis",
    "Surfent Terra": "Anubis",
    "Maraith": "Broncherry",
    "Digtoise": "Blazehowl",
    "Tombat": "Vanwyrm",
    "Lovander": "Foxcicle",
    "Flambelle": "Verdash",
    "Vanwyrm": "Bushi",
    "Vanwyrm Cryst": "Incineram",
    "Bushi": "Incineram",
    "Beakon": "Sweepa",
    "Ragnahawk": "Wumpo Botan",
    "Katress": "Bushi",
    "Wixen": "Celaray",
    "Verdash": "Arsox",
    "Vaelet": "Dinossom",
    "Sibelyx": "Penking",
    "Elphidran": "Surfent",
    "Elphidran Aqua": "Surfent",
    "Kelpsea": "Eikthyrdeer",
    "Kelpsea Ignis": "Eikthyrdeer",
    "Azurobe": "Elphidran",
    "Cryolinx": "Pyrin",
    "Blazehowl": "Bushi",
    "Blazehowl Noct": "Bushi",
    "Relaxaurus": "Mossanda",
    "Relaxaurus Lux": "Nitewing",
    "Broncherry": "Blazehowl",
    "Broncherry Aqua": "Blazehowl",
    "Petallia": "Univolt",
    "Reptyro": "Sibelyx",
    "Ice Reptyro": "Sweepa",
    "Kingpaca": "Penking",
    "Ice Kingpaca": "Grintale",
    "Mammorest": "Sibelyx",
    "Mammorest Cryst": "Mossanda",
    "Wumpo": "Penking",
    "Wumpo Botan": "Elphidran",
    "Warsect": "Wumpo",
    "Fenglope": "Petallia",
    "Felbat": "Arsox",
    "Quivern": "Wumpo",
    "Blazamut": "Mammorest",
    "Helzephyr": "Ragnahawk",
    "Astegon": "Pyrin",
    "Menasting": "Nitewing",
    "Anubis": "Anubis",
    "Jormuntide": "Sibelyx",
    "Jormuntide Ignis": "Sibelyx",
    "Suzaku": "Jormuntide",
    "Suzaku Aqua": "Jormuntide",
    "Grizzbolt": "Ragnahawk",
    "Lyleen": "Nitewing",
    "Lyleen Noct": "Sweepa",
    "Faleris": "Wumpo Botan",
    "Orserk": "Pyrin",
    "Shadowbeak": "Reptyro",
    "Paladius": "Elizabee",
    "Necromus": "Reptyro",
    "Frostallion": "Quivern",
    "Frostallion Noct": "Warsect",
    "Jetragon": "Elizabee"
  },
  "Cinnamoth": {
    "Lamball": "Fenglope",
    "Cattiva": "Fenglope",
    "Chikipi": "Verdash",
    "Lifmunk": "Loupmoon",
    "Foxparks": "Loupmoon",
    "Fuack": "Mozzarina",
    "Sparkit": "Loupmoon",
    "Tanzee": "Celaray",
    "Rooby": "Dinossom",
    "Pengullet": "Eikthyrdeer",
    "Penking": "Azurobe",
    "Jolthog": "Caprity",
    "Jolthog Cryst": "Eikthyrdeer",
    "Gumoss": "Broncherry",
    "Gumoss (Special)": "Broncherry",
    "Vixy": "Fenglope",
    "Hoocrates": "Lovander",
    "Teafant": "Verdash",
    "Depresso": "Caprity",
    "Cremis": "Fenglope",
    "Daedream": "Broncherry",
    "Rushoar": "Dinossom",
    "Nox": "Kitsun",
    "Fuddler": "Digtoise",
    "Killamari": "Melpaca",
    "Mau": "Fenglope",
    "Mau Cryst": "Loupmoon",
    "Celaray": "Univolt",
    "Direhowl": "Petallia",
    "Tocotoco": "Eikthyrdeer",
    "Flopie": "Melpaca",
    "Mozzarina": "Katress",
    "Bristla": "Mozzarina",
    "Gobfin": "Arsox",
    "Gobfin Ignis": "Arsox",
    "Hangyu": "Loupmoon",
    "Hangyu Cryst": "Loupmoon",
    "Mossanda": "Wumpo",
    "Mossanda Lux": "Sibelyx",
    "Woolipop": "Digtoise",
    "Caprity": "Blazehowl",
    "Melpaca": "Univolt",
    "Eikthyrdeer": "Blazehowl",
    "Eikthyrdeer Terra": "Katress",
    "Nitewing": "Sibelyx",
    "Ribunny": "Dumud",
    "Incineram": "Elphidran",
    "Incineram Noct": "Elphidran",
    "Cinnamoth": "Cinnamoth",
    "Arsox": "Bushi",
    "Dumud": "Katress",
    "Cawgnito": "Arsox",
    "Leezpunk": "Chillet",
    "Leezpunk Ignis": "Dinossom",
    "Loupmoon": "Blazehowl",
    "Galeclaw": "Foxcicle",
    "Robinquill": "Tombat",
    "Robinquill Terra": "Tombat",
    "Gorirat": "Foxcicle",
    "Beegarde": "Petallia",
    "Elizabee": "Sweepa",
    "Grintale": "Azurobe",
    "Swee": "Dumud",
    "Sweepa": "Sibelyx",
    "Chillet": "Bushi",
    "Univolt": "Incineram",
    "Foxcicle": "Bushi",
    "Pyrin": "Nitewing",
    "Pyrin Noct": "Pyrin",
    "Reindrix": "Univolt",
    "Rayhound": "Incineram",
    "Kitsun": "Vanwyrm",
    "Dazzi": "Digtoise",
    "Lunaris": "Chillet",
    "Dinossom": "Vanwyrm",
    "Dinossom Lux": "Vanwyrm",
    "Surfent": "Penking",
    "Surfent Terra": "Penking",
    "Maraith": "Dinossom",
    "Digtoise": "Univolt",
    "Tombat": "Bushi",
    "Lovander": "Blazehowl",
    "Flambelle": "Loupmoon",
    "Vanwyrm": "Anubis",
    "Vanwyrm Cryst": "Surfent",
    "Bushi": "Anubis",
    "Beakon": "Pyrin",
    "Ragnahawk": "Mossanda",
    "Katress": "Incineram",
    "Wixen": "Kitsun",
    "Verdash": "Rayhound",
    "Vaelet": "Foxcicle",
    "Sibelyx": "Kingpaca",
    "Elphidran": "Penking",
    "Elphidran Aqua": "Grintale",
    "Kelpsea": "Reindrix",
    "Kelpsea Ignis": "Reindrix",
    "Azurobe": "Azurobe",
    "Cryolinx": "Jormuntide",
    "Blazehowl": "Incineram",
    "Blazehowl Noct": "Anubis",
    "Relaxaurus": "Ragnahawk",
    "Relaxaurus Lux": "Ragnahawk",
    "Broncherry": "Univolt",
    "Broncherry Aqua": "Vanwyrm",
    "Petallia": "Bushi",
    "Reptyro": "Sweepa",
    "Ice Reptyro": "Pyrin",
    "Kingpaca": "Wumpo Botan",
    "Ice Kingpaca": "Wumpo",
    "Mammorest": "Sweepa",
    "Mammorest Cryst": "Ragnahawk",
    "Wumpo": "Wumpo Botan",
    "Wumpo Botan": "Wumpo Botan",
    "Warsect": "Nitewing",
    "Fenglope": "Rayhound",
    "Felbat": "Tombat",
    "Quivern": "Nitewing",
    "Blazamut": "Menasting",
    "Helzephyr": "Warsect",
    "Astegon": "Reptyro",
    "Menasting": "Ragnahawk",
    "Anubis": "Elphidran",
    "Jormuntide": "Sweepa",
    "Jormuntide Ignis": "Sweepa",
    "Suzaku": "Relaxaurus",
    "Suzaku Aqua": "Menasting",
    "Grizzbolt": "Warsect",
    "Lyleen": "Pyrin",
    "Lyleen Noct": "Quivern",
    "Faleris": "Mossanda",
    "Orserk": "Jormuntide",
    "Shadowbeak": "Relaxaurus",
    "Paladius": "Relaxaurus",
    "Necromus": "Relaxaurus",
    "Frostallion": "Jormuntide",
    "Frostallion Noct": "Mammorest",
    "Jetragon": "Relaxaurus"
  },
  "Arsox": {
    "Lamball": "Rushoar",
    "Cattiva": "Rushoar",
    "Chikipi": "Maraith",
    "Lifmunk": "Lunaris",
    "Foxparks": "Gobfin",
    "Fuack": "Direhowl",
    "Sparkit": "Lunaris",
    "Tanzee": "Robinquill",
    "Rooby": "Fenglope",
    "Pengullet": "Beegarde",
    "Penking": "Vanwyrm",
    "Jolthog": "Cawgnito",
    "Jolthog Cryst": "Cawgnito",
    "Gumoss": "Robinquill",
    "Gumoss (Special)": "Robinquill",
    "Vixy": "Leezpunk",
    "Hoocrates": "Gobfin",
    "Teafant": "Rushoar",
    "Depresso": "Gobfin",
    "Cremis": "Leezpunk",
    "Daedream": "Felbat",
    "Rushoar": "Loupmoon",
    "Nox": "Fenglope",
    "Fuddler": "Felbat",
    "Killamari": "Gorirat",
    "Mau": "Rushoar",
    "Mau Cryst": "Lunaris",
    "Celaray": "Kitsun",
    "Direhowl": "Eikthyrdeer",
    "Tocotoco": "Direhowl",
    "Flopie": "Galeclaw",
    "Mozzarina": "Digtoise",
    "Bristla": "Direhowl",
    "Gobfin": "Lovander",
    "Gobfin Ignis": "Loupmoon",
    "Hangyu": "Lunaris",
    "Hangyu Cryst": "Lunaris",
    "Mossanda": "Incineram",
    "Mossanda Lux": "Incineram",
    "Woolipop": "Verdash",
    "Caprity": "Broncherry",
    "Melpaca": "Digtoise",
    "Eikthyrdeer": "Digtoise",
    "Eikthyrdeer Terra": "Digtoise",
    "Nitewing": "Incineram",
    "Ribunny": "Vaelet",
    "Incineram": "Univolt",
    "Incineram Noct": "Univolt",
    "Cinnamoth": "Bushi",
    "Arsox": "Arsox",
    "Dumud": "Digtoise",
    "Cawgnito": "Caprity",
    "Leezpunk": "Loupmoon",
    "Leezpunk Ignis": "Loupmoon",
    "Loupmoon": "Celaray",
    "Galeclaw": "Mozzarina",
    "Robinquill": "Mozzarina",
    "Robinquill Terra": "Dumud",
    "Gorirat": "Eikthyrdeer",
    "Beegarde": "Caprity",
    "Elizabee": "Surfent",
    "Grintale": "Vanwyrm",
    "Swee": "Gorirat",
    "Sweepa": "Incineram",
    "Chillet": "Arsox",
    "Univolt": "Rayhound",
    "Foxcicle": "Petallia",
    "Pyrin": "Anubis",
    "Pyrin Noct": "Penking",
    "Reindrix": "Kitsun",
    "Rayhound": "Foxcicle",
    "Kitsun": "Dinossom",
    "Dazzi": "Felbat",
    "Lunaris": "Loupmoon",
    "Dinossom": "Chillet",
    "Dinossom Lux": "Chillet",
    "Surfent": "Univolt",
    "Surfent Terra": "Univolt",
    "Maraith": "Fenglope",
    "Digtoise": "Dinossom",
    "Tombat": "Foxcicle",
    "Lovander": "Broncherry",
    "Flambelle": "Gobfin",
    "Vanwyrm": "Rayhound",
    "Vanwyrm Cryst": "Blazehowl",
    "Bushi": "Blazehowl",
    "Beakon": "Azurobe",
    "Ragnahawk": "Incineram",
    "Katress": "Tombat",
    "Wixen": "Fenglope",
    "Verdash": "Melpaca",
    "Vaelet": "Eikthyrdeer",
    "Sibelyx": "Bushi",
    "Elphidran": "Vanwyrm",
    "Elphidran Aqua": "Vanwyrm",
    "Kelpsea": "Galeclaw",
    "Kelpsea Ignis": "Galeclaw",
    "Azurobe": "Bushi",
    "Cryolinx": "Wumpo",
    "Blazehowl": "Tombat",
    "Blazehowl Noct": "Rayhound",
    "Relaxaurus": "Elphidran",
    "Relaxaurus Lux": "Elphidran",
    "Broncherry": "Kitsun",
    "Broncherry Aqua": "Dinossom",
    "Petallia": "Arsox",
    "Reptyro": "Surfent",
    "Ice Reptyro": "Grintale",
    "Kingpaca": "Bushi",
    "Ice Kingpaca": "Incineram",
    "Mammorest": "Elphidran",
    "Mammorest Cryst": "Elphidran",
    "Wumpo": "Bushi",
    "Wumpo Botan": "Bushi",
    "Warsect": "Anubis",
    "Fenglope": "Melpaca",
    "Felbat": "Dumud",
    "Quivern": "Anubis",
    "Blazamut": "Sweepa",
    "Helzephyr": "Cinnamoth",
    "Astegon": "Kingpaca",
    "Menasting": "Penking",
    "Anubis": "Univolt",
    "Jormuntide": "Elphidran",
    "Jormuntide Ignis": "Surfent",
    "Suzaku": "Nitewing",
    "Suzaku Aqua": "Sweepa",
    "Grizzbolt": "Azurobe",
    "Lyleen": "Penking",
    "Lyleen Noct": "Azurobe",
    "Faleris": "Anubis",
    "Orserk": "Wumpo",
    "Shadowbeak": "Nitewing",
    "Paladius": "Mossanda",
    "Necromus": "Mossanda",
    "Frostallion": "Sibelyx",
    "Frostallion Noct": "Sibelyx",
    "Jetragon": "Sibelyx"
  },
  "Dumud": {
    "Lamball": "Nox",
    "Cattiva": "Nox",
    "Chikipi": "Woolipop",
    "Lifmunk": "Wixen",
    "Foxparks": "Maraith",
    "Fuack": "Lunaris",
    "Sparkit": "Rooby",
    "Tanzee": "Beegarde",
    "Rooby": "Galeclaw",
    "Pengullet": "Leezpunk",
    "Penking": "Blazehowl",
    "Jolthog": "Rushoar",
    "Jolthog Cryst": "Rushoar",
    "Gumoss": "Beegarde",
    "Gumoss (Special)": "Beegarde",
    "Vixy": "Nox",
    "Hoocrates": "Maraith",
    "Teafant": "Woolipop",
    "Depresso": "Rushoar",
    "Cremis": "Nox",
    "Daedream": "Direhowl",
    "Rushoar": "Felbat",
    "Nox": "Gorirat",
    "Fuddler": "Direhowl",
    "Killamari": "Gobfin",
    "Mau": "Woolipop",
    "Mau Cryst": "Wixen",
    "Celaray": "Reindrix",
    "Direhowl": "Fenglope",
    "Tocotoco": "Leezpunk",
    "Flopie": "Gobfin",
    "Mozzarina": "Mozzarina",
    "Bristla": "Lunaris",
    "Gobfin": "Verdash",
    "Gobfin Ignis": "Verdash",
    "Hangyu": "Wixen",
    "Hangyu Cryst": "Wixen",
    "Mossanda": "Vanwyrm",
    "Mossanda Lux": "Bushi",
    "Woolipop": "Gorirat",
    "Caprity": "Mozzarina",
    "Melpaca": "Dumud",
    "Eikthyrdeer": "Mozzarina",
    "Eikthyrdeer Terra": "Dumud",
    "Nitewing": "Vanwyrm",
    "Ribunny": "Lunaris",
    "Incineram": "Rayhound",
    "Incineram Noct": "Rayhound",
    "Cinnamoth": "Katress",
    "Arsox": "Digtoise",
    "Dumud": "Dumud",
    "Cawgnito": "Verdash",
    "Leezpunk": "Felbat",
    "Leezpunk Ignis": "Robinquill",
    "Loupmoon": "Eikthyrdeer",
    "Galeclaw": "Loupmoon",
    "Robinquill": "Loupmoon",
    "Robinquill Terra": "Loupmoon",
    "Gorirat": "Fenglope",
    "Beegarde": "Fenglope",
    "Elizabee": "Incineram",
    "Grintale": "Katress",
    "Swee": "Gobfin",
    "Sweepa": "Vanwyrm",
    "Chillet": "Digtoise",
    "Univolt": "Arsox",
    "Foxcicle": "Kitsun",
    "Pyrin": "Bushi",
    "Pyrin Noct": "Anubis",
    "Reindrix": "Melpaca",
    "Rayhound": "Dinossom",
    "Kitsun": "Broncherry",
    "Dazzi": "Vaelet",
    "Lunaris": "Felbat",
    "Dinossom": "Broncherry",
    "Dinossom Lux": "Digtoise",
    "Surfent": "Surfent Terra",
    "Surfent Terra": "Blazehowl",
    "Maraith": "Robinquill",
    "Digtoise": "Celaray",
    "Tombat": "Dinossom",
    "Lovander": "Eikthyrdeer",
    "Flambelle": "Maraith",
    "Vanwyrm": "Petallia",
    "Vanwyrm Cryst": "Foxcicle",
    "Bushi": "Foxcicle",
    "Beakon": "Surfent",
    "Ragnahawk": "Bushi",
    "Katress": "Chillet",
    "Wixen": "Galeclaw",
    "Verdash": "Lovander",
    "Vaelet": "Fenglope",
    "Sibelyx": "Univolt",
    "Elphidran": "Blazehowl",
    "Elphidran Aqua": "Blazehowl",
    "Kelpsea": "Cawgnito",
    "Kelpsea Ignis": "Cawgnito",
    "Azurobe": "Katress",
    "Cryolinx": "Grintale",
    "Blazehowl": "Chillet",
    "Blazehowl Noct": "Petallia",
    "Relaxaurus": "Incineram",
    "Relaxaurus Lux": "Incineram",
    "Broncherry": "Reindrix",
    "Broncherry Aqua": "Celaray",
    "Petallia": "Kitsun",
    "Reptyro": "Incineram",
    "Ice Reptyro": "Surfent",
    "Kingpaca": "Univolt",
    "Ice Kingpaca": "Vanwyrm",
    "Mammorest": "Incineram",
    "Mammorest Cryst": "Incineram",
    "Wumpo": "Univolt",
    "Wumpo Botan": "Univolt",
    "Warsect": "Bushi",
    "Fenglope": "Lovander",
    "Felbat": "Loupmoon",
    "Quivern": "Bushi",
    "Blazamut": "Sibelyx",
    "Helzephyr": "Elphidran",
    "Astegon": "Penking",
    "Menasting": "Anubis",
    "Anubis": "Rayhound",
    "Jormuntide": "Incineram",
    "Jormuntide Ignis": "Incineram",
    "Suzaku": "Kingpaca",
    "Suzaku Aqua": "Wumpo",
    "Grizzbolt": "Elphidran",
    "Lyleen": "Anubis",
    "Lyleen Noct": "Surfent",
    "Faleris": "Bushi",
    "Orserk": "Penking",
    "Shadowbeak": "Wumpo Botan",
    "Paladius": "Cinnamoth",
    "Necromus": "Wumpo Botan",
    "Frostallion": "Grintale",
    "Frostallion Noct": "Azurobe",
    "Jetragon": "Cinnamoth"
  },
  "Cawgnito": {
    "Lamball": "Kelpsea Ignis",
    "Cattiva": "Kelpsea Ignis",
    "Chikipi": "Killamari",
    "Lifmunk": "Kelpsea",
    "Foxparks": "Gumoss",
    "Fuack": "Dazzi",
    "Sparkit": "Tanzee",
    "Tanzee": "Wixen",
    "Rooby": "Leezpunk",
    "Pengullet": "Dazzi",
    "Penking": "Chillet",
    "Jolthog": "Fuddler",
    "Jolthog Cryst": "Fuddler",
    "Gumoss": "Wixen",
    "Gumoss (Special)": "Wixen",
    "Vixy": "Kelpsea",
    "Hoocrates": "Daedream",
    "Teafant": "Killamari",
    "Depresso": "Daedream",
    "Cremis": "Kelpsea Ignis",
    "Daedream": "Rooby",
    "Rushoar": "Lunaris",
    "Nox": "Rushoar",
    "Fuddler": "Maraith",
    "Killamari": "Woolipop",
    "Mau": "Flopie",
    "Mau Cryst": "Kelpsea",
    "Celaray": "Fenglope",
    "Direhowl": "Beegarde",
    "Tocotoco": "Dazzi",
    "Flopie": "Nox",
    "Mozzarina": "Verdash",
    "Bristla": "Dazzi",
    "Gobfin": "Gobfin",
    "Gobfin Ignis": "Gobfin",
    "Hangyu": "Tanzee",
    "Hangyu Cryst": "Tanzee",
    "Mossanda": "Tombat",
    "Mossanda Lux": "Rayhound",
    "Woolipop": "Rushoar",
    "Caprity": "Felbat",
    "Melpaca": "Fenglope",
    "Eikthyrdeer": "Felbat",
    "Eikthyrdeer Terra": "Verdash",
    "Nitewing": "Tombat",
    "Ribunny": "Woolipop",
    "Incineram": "Kitsun",
    "Incineram Noct": "Kitsun",
    "Cinnamoth": "Arsox",
    "Arsox": "Caprity",
    "Dumud": "Verdash",
    "Cawgnito": "Cawgnito",
    "Leezpunk": "Lunaris",
    "Leezpunk Ignis": "Lunaris",
    "Loupmoon": "Robinquill",
    "Galeclaw": "Direhowl",
    "Robinquill": "Vaelet",
    "Robinquill Terra": "Gorirat",
    "Gorirat": "Direhowl",
    "Beegarde": "Cawgnito",
    "Elizabee": "Blazehowl",
    "Grintale": "Arsox",
    "Swee": "Woolipop",
    "Sweepa": "Tombat",
    "Chillet": "Lovander",
    "Univolt": "Reindrix",
    "Foxcicle": "Eikthyrdeer",
    "Pyrin": "Blazehowl",
    "Pyrin Noct": "Vanwyrm",
    "Reindrix": "Fenglope",
    "Rayhound": "Mozzarina",
    "Kitsun": "Loupmoon",
    "Dazzi": "Maraith",
    "Lunaris": "Gobfin",
    "Dinossom": "Loupmoon",
    "Dinossom Lux": "Loupmoon",
    "Surfent": "Dinossom",
    "Surfent Terra": "Dinossom",
    "Maraith": "Lunaris",
    "Digtoise": "Loupmoon",
    "Tombat": "Eikthyrdeer",
    "Lovander": "Felbat",
    "Flambelle": "Gumoss",
    "Vanwyrm": "Celaray",
    "Vanwyrm Cryst": "Digtoise",
    "Bushi": "Broncherry",
    "Beakon": "Vanwyrm",
    "Ragnahawk": "Rayhound",
    "Katress": "Melpaca",
    "Wixen": "Leezpunk",
    "Verdash": "Galeclaw",
    "Vaelet": "Direhowl",
    "Sibelyx": "Foxcicle",
    "Elphidran": "Dinossom",
    "Elphidran Aqua": "Chillet",
    "Kelpsea": "Wixen",
    "Kelpsea Ignis": "Nox",
    "Azurobe": "Arsox",
    "Cryolinx": "Incineram",
    "Blazehowl": "Dumud",
    "Blazehowl Noct": "Reindrix",
    "Relaxaurus": "Univolt",
    "Relaxaurus Lux": "Univolt",
    "Broncherry": "Fenglope",
    "Broncherry Aqua": "Loupmoon",
    "Petallia": "Caprity",
    "Reptyro": "Katress",
    "Ice Reptyro": "Vanwyrm",
    "Kingpaca": "Petallia",
    "Ice Kingpaca": "Foxcicle",
    "Mammorest": "Univolt",
    "Mammorest Cryst": "Univolt",
    "Wumpo": "Foxcicle",
    "Wumpo Botan": "Petallia",
    "Warsect": "Blazehowl",
    "Fenglope": "Galeclaw",
    "Felbat": "Gorirat",
    "Quivern": "Blazehowl",
    "Blazamut": "Elphidran",
    "Helzephyr": "Bushi",
    "Astegon": "Incineram",
    "Menasting": "Univolt",
    "Anubis": "Kitsun",
    "Jormuntide": "Katress",
    "Jormuntide Ignis": "Katress",
    "Suzaku": "Anubis",
    "Suzaku Aqua": "Surfent",
    "Grizzbolt": "Bushi",
    "Lyleen": "Vanwyrm",
    "Lyleen Noct": "Bushi",
    "Faleris": "Rayhound",
    "Orserk": "Incineram",
    "Shadowbeak": "Anubis",
    "Paladius": "Anubis",
    "Necromus": "Anubis",
    "Frostallion": "Incineram",
    "Frostallion Noct": "Incineram",
    "Jetragon": "Incineram"
  },
  "Leezpunk": {
    "Lamball": "Killamari",
    "Cattiva": "Killamari",
    "Chikipi": "Ribunny",
    "Lifmunk": "Kelpsea Ignis",
    "Foxparks": "Kelpsea",
    "Fuack": "Fuddler",
    "Sparkit": "Kelpsea",
    "Tanzee": "Woolipop",
    "Rooby": "Rushoar",
    "Pengullet": "Daedream",
    "Penking": "Dinossom",
    "Jolthog": "Tanzee",
    "Jolthog Cryst": "Gumoss",
    "Gumoss": "Nox",
    "Gumoss (Special)": "Nox",
    "Vixy": "Killamari",
    "Hoocrates": "Kelpsea",
    "Teafant": "Swee",
    "Depresso": "Tanzee",
    "Cremis": "Killamari",
    "Daedream": "Nox",
    "Rushoar": "Rushoar",
    "Nox": "Maraith",
    "Fuddler": "Wixen",
    "Killamari": "Dazzi",
    "Mau": "Swee",
    "Mau Cryst": "Flopie",
    "Celaray": "Verdash",
    "Direhowl": "Gobfin",
    "Tocotoco": "Daedream",
    "Flopie": "Dazzi",
    "Mozzarina": "Robinquill",
    "Bristla": "Fuddler",
    "Gobfin": "Lunaris",
    "Gobfin Ignis": "Lunaris",
    "Hangyu": "Kelpsea Ignis",
    "Hangyu Cryst": "Kelpsea Ignis",
    "Mossanda": "Petallia",
    "Mossanda Lux": "Tombat",
    "Woolipop": "Rooby",
    "Caprity": "Galeclaw",
    "Melpaca": "Felbat",
    "Eikthyrdeer": "Robinquill",
    "Eikthyrdeer Terra": "Felbat",
    "Nitewing": "Foxcicle",
    "Ribunny": "Dazzi",
    "Incineram": "Digtoise",
    "Incineram Noct": "Digtoise",
    "Cinnamoth": "Chillet",
    "Arsox": "Loupmoon",
    "Dumud": "Felbat",
    "Cawgnito": "Lunaris",
    "Leezpunk": "Leezpunk",
    "Leezpunk Ignis": "Rushoar",
    "Loupmoon": "Galeclaw",
    "Galeclaw": "Cawgnito",
    "Robinquill": "Beegarde",
    "Robinquill Terra": "Direhowl",
    "Gorirat": "Cawgnito",
    "Beegarde": "Gobfin",
    "Elizabee": "Rayhound",
    "Grintale": "Dinossom",
    "Swee": "Dazzi",
    "Sweepa": "Foxcicle",
    "Chillet": "Loupmoon",
    "Univolt": "Dumud",
    "Foxcicle": "Lovander",
    "Pyrin": "Rayhound",
    "Pyrin Noct": "Univolt",
    "Reindrix": "Felbat",
    "Rayhound": "Caprity",
    "Kitsun": "Fenglope",
    "Dazzi": "Wixen",
    "Lunaris": "Lunaris",
    "Dinossom": "Fenglope",
    "Dinossom Lux": "Loupmoon",
    "Surfent": "Digtoise",
    "Surfent Terra": "Kitsun",
    "Maraith": "Rushoar",
    "Digtoise": "Fenglope",
    "Tombat": "Caprity",
    "Lovander": "Galeclaw",
    "Flambelle": "Leezpunk Ignis",
    "Vanwyrm": "Melpaca",
    "Vanwyrm Cryst": "Celaray",
    "Bushi": "Reindrix",
    "Beakon": "Univolt",
    "Ragnahawk": "Tombat",
    "Katress": "Mozzarina",
    "Wixen": "Rushoar",
    "Verdash": "Direhowl",
    "Vaelet": "Gobfin",
    "Sibelyx": "Arsox",
    "Elphidran": "Kitsun",
    "Elphidran Aqua": "Kitsun",
    "Kelpsea": "Woolipop",
    "Kelpsea Ignis": "Woolipop",
    "Azurobe": "Dinossom",
    "Cryolinx": "Bushi",
    "Blazehowl": "Eikthyrdeer",
    "Blazehowl Noct": "Dumud",
    "Relaxaurus": "Katress",
    "Relaxaurus Lux": "Katress",
    "Broncherry": "Verdash",
    "Broncherry Aqua": "Fenglope",
    "Petallia": "Loupmoon",
    "Reptyro": "Blazehowl",
    "Ice Reptyro": "Univolt",
    "Kingpaca": "Arsox",
    "Ice Kingpaca": "Petallia",
    "Mammorest": "Blazehowl",
    "Mammorest Cryst": "Blazehowl",
    "Wumpo": "Arsox",
    "Wumpo Botan": "Chillet",
    "Warsect": "Rayhound",
    "Fenglope": "Vaelet",
    "Felbat": "Direhowl",
    "Quivern": "Rayhound",
    "Blazamut": "Anubis",
    "Helzephyr": "Vanwyrm",
    "Astegon": "Bushi",
    "Menasting": "Univolt",
    "Anubis": "Digtoise",
    "Jormuntide": "Blazehowl",
    "Jormuntide Ignis": "Blazehowl",
    "Suzaku": "Incineram",
    "Suzaku Aqua": "Anubis",
    "Grizzbolt": "Vanwyrm",
    "Lyleen": "Univolt",
    "Lyleen Noct": "Vanwyrm",
    "Faleris": "Tombat",
    "Orserk": "Bushi",
    "Shadowbeak": "Incineram",
    "Paladius": "Incineram",
    "Necromus": "Incineram",
    "Frostallion": "Bushi",
    "Frostallion Noct": "Incineram",
    "Jetragon": "Incineram"
  },
  "Leezpunk Ignis": {
    "variant": true,
    "Lamball": "Swee",
    "Cattiva": "Swee",
    "Chikipi": "Bristla",
    "Lifmunk": "Killamari",
    "Foxparks": "Kelpsea Ignis",
    "Fuack": "Daedream",
    "Sparkit": "Kelpsea Ignis",
    "Tanzee": "Woolipop",
    "Rooby": "Maraith",
    "Pengullet": "Tanzee",
    "Penking": "Kitsun",
    "Jolthog": "Kelpsea",
    "Jolthog Cryst": "Tanzee",
    "Gumoss": "Woolipop",
    "Gumoss (Special)": "Woolipop",
    "Vixy": "Killamari",
    "Hoocrates": "Kelpsea",
    "Teafant": "Bristla",
    "Depresso": "Kelpsea",
    "Cremis": "Swee",
    "Daedream": "Woolipop",
    "Rushoar": "Rushoar",
    "Nox": "Wixen",
    "Fuddler": "Nox",
    "Killamari": "Dazzi",
    "Mau": "Ribunny",
    "Mau Cryst": "Killamari",
    "Celaray": "Felbat",
    "Direhowl": "Lunaris",
    "Tocotoco": "Gumoss",
    "Flopie": "Dazzi",
    "Mozzarina": "Galeclaw",
    "Bristla": "Daedream",
    "Gobfin": "Lunaris",
    "Gobfin Ignis": "Leezpunk",
    "Hangyu": "Flopie",
    "Hangyu Cryst": "Flopie",
    "Mossanda": "Arsox",
    "Mossanda Lux": "Foxcicle",
    "Woolipop": "Wixen",
    "Caprity": "Galeclaw",
    "Melpaca": "Robinquill",
    "Eikthyrdeer": "Galeclaw",
    "Eikthyrdeer Terra": "Robinquill",
    "Nitewing": "Petallia",
    "Ribunny": "Fuddler",
    "Incineram": "Broncherry",
    "Incineram Noct": "Broncherry",
    "Cinnamoth": "Dinossom",
    "Arsox": "Loupmoon",
    "Dumud": "Robinquill",
    "Cawgnito": "Lunaris",
    "Leezpunk": "Rushoar",
    "Leezpunk Ignis": "Leezpunk Ignis",
    "Loupmoon": "Gorirat",
    "Galeclaw": "Gobfin",
    "Robinquill": "Cawgnito",
    "Robinquill Terra": "Beegarde",
    "Gorirat": "Gobfin",
    "Beegarde": "Lunaris",
    "Elizabee": "Rayhound",
    "Grintale": "Kitsun",
    "Swee": "Fuddler",
    "Sweepa": "Petallia",
    "Chillet": "Fenglope",
    "Univolt": "Mozzarina",
    "Foxcicle": "Loupmoon",
    "Pyrin": "Tombat",
    "Pyrin Noct": "Univolt",
    "Reindrix": "Felbat",
    "Rayhound": "Lovander",
    "Kitsun": "Fenglope",
    "Dazzi": "Nox",
    "Lunaris": "Rushoar",
    "Dinossom": "Fenglope",
    "Dinossom Lux": "Fenglope",
    "Surfent": "Digtoise",
    "Surfent Terra": "Digtoise",
    "Maraith": "Maraith",
    "Digtoise": "Verdash",
    "Tombat": "Loupmoon",
    "Lovander": "Gorirat",
    "Flambelle": "Kelpsea Ignis",
    "Vanwyrm": "Dumud",
    "Vanwyrm Cryst": "Reindrix",
    "Bushi": "Melpaca",
    "Beakon": "Univolt",
    "Ragnahawk": "Foxcicle",
    "Katress": "Eikthyrdeer",
    "Wixen": "Maraith",
    "Verdash": "Direhowl",
    "Vaelet": "Gobfin",
    "Sibelyx": "Arsox",
    "Elphidran": "Digtoise",
    "Elphidran Aqua": "Kitsun",
    "Kelpsea": "Dazzi",
    "Kelpsea Ignis": "Dazzi",
    "Azurobe": "Dinossom",
    "Cryolinx": "Bushi",
    "Blazehowl": "Eikthyrdeer",
    "Blazehowl Noct": "Mozzarina",
    "Relaxaurus": "Blazehowl",
    "Relaxaurus Lux": "Blazehowl",
    "Broncherry": "Felbat",
    "Broncherry Aqua": "Verdash",
    "Petallia": "Loupmoon",
    "Reptyro": "Rayhound",
    "Ice Reptyro": "Univolt",
    "Kingpaca": "Chillet",
    "Ice Kingpaca": "Arsox",
    "Mammorest": "Blazehowl",
    "Mammorest Cryst": "Blazehowl",
    "Wumpo": "Chillet",
    "Wumpo Botan": "Dinossom",
    "Warsect": "Rayhound",
    "Fenglope": "Direhowl",
    "Felbat": "Cawgnito",
    "Quivern": "Tombat",
    "Blazamut": "Anubis",
    "Helzephyr": "Vanwyrm",
    "Astegon": "Bushi",
    "Menasting": "Katress",
    "Anubis": "Digtoise",
    "Jormuntide": "Rayhound",
    "Jormuntide Ignis": "Rayhound",
    "Suzaku": "Incineram",
    "Suzaku Aqua": "Incineram",
    "Grizzbolt": "Univolt",
    "Lyleen": "Katress",
    "Lyleen Noct": "Univolt",
    "Faleris": "Tombat",
    "Orserk": "Bushi",
    "Shadowbeak": "Incineram",
    "Paladius": "Incineram",
    "Necromus": "Incineram",
    "Frostallion": "Bushi",
    "Frostallion Noct": "Bushi",
    "Jetragon": "Incineram"
  },
  "Loupmoon": {
    "Lamball": "Dazzi",
    "Cattiva": "Dazzi",
    "Chikipi": "Fuddler",
    "Lifmunk": "Woolipop",
    "Foxparks": "Nox",
    "Fuack": "Rushoar",
    "Sparkit": "Nox",
    "Tanzee": "Lunaris",
    "Rooby": "Vaelet",
    "Pengullet": "Maraith",
    "Penking": "Rayhound",
    "Jolthog": "Wixen",
    "Jolthog Cryst": "Rooby",
    "Gumoss": "Gobfin",
    "Gumoss (Special)": "Gobfin",
    "Vixy": "Dazzi",
    "Hoocrates": "Wixen",
    "Teafant": "Fuddler",
    "Depresso": "Wixen",
    "Cremis": "Dazzi",
    "Daedream": "Gobfin",
    "Rushoar": "Gorirat",
    "Nox": "Direhowl",
    "Fuddler": "Gobfin",
    "Killamari": "Leezpunk",
    "Mau": "Dazzi",
    "Mau Cryst": "Woolipop",
    "Celaray": "Mozzarina",
    "Direhowl": "Felbat",
    "Tocotoco": "Maraith",
    "Flopie": "Lunaris",
    "Mozzarina": "Caprity",
    "Bristla": "Rushoar",
    "Gobfin": "Robinquill",
    "Gobfin Ignis": "Galeclaw",
    "Hangyu": "Woolipop",
    "Hangyu Cryst": "Woolipop",
    "Mossanda": "Univolt",
    "Mossanda Lux": "Univolt",
    "Woolipop": "Beegarde",
    "Caprity": "Lovander",
    "Melpaca": "Eikthyrdeer",
    "Eikthyrdeer": "Caprity",
    "Eikthyrdeer Terra": "Eikthyrdeer",
    "Nitewing": "Univolt",
    "Ribunny": "Rushoar",
    "Incineram": "Foxcicle",
    "Incineram Noct": "Foxcicle",
    "Cinnamoth": "Blazehowl",
    "Arsox": "Celaray",
    "Dumud": "Eikthyrdeer",
    "Cawgnito": "Robinquill",
    "Leezpunk": "Galeclaw",
    "Leezpunk Ignis": "Gorirat",
    "Loupmoon": "Loupmoon",
    "Galeclaw": "Verdash",
    "Robinquill": "Fenglope",
    "Robinquill Terra": "Fenglope",
    "Gorirat": "Verdash",
    "Beegarde": "Felbat",
    "Elizabee": "Bushi",
    "Grintale": "Rayhound",
    "Swee": "Rushoar",
    "Sweepa": "Univolt",
    "Chillet": "Reindrix",
    "Univolt": "Dinossom",
    "Foxcicle": "Digtoise",
    "Pyrin": "Vanwyrm",
    "Pyrin Noct": "Incineram",
    "Reindrix": "Eikthyrdeer",
    "Rayhound": "Digtoise",
    "Kitsun": "Melpaca",
    "Dazzi": "Cawgnito",
    "Lunaris": "Galeclaw",
    "Dinossom": "Melpaca",
    "Dinossom Lux": "Reindrix",
    "Surfent": "Tombat",
    "Surfent Terra": "Tombat",
    "Maraith": "Vaelet",
    "Digtoise": "Dumud",
    "Tombat": "Digtoise",
    "Lovander": "Loupmoon",
    "Flambelle": "Nox",
    "Vanwyrm": "Chillet",
    "Vanwyrm Cryst": "Arsox",
    "Bushi": "Arsox",
    "Beakon": "Incineram",
    "Ragnahawk": "Vanwyrm",
    "Katress": "Kitsun",
    "Wixen": "Direhowl",
    "Verdash": "Fenglope",
    "Vaelet": "Felbat",
    "Sibelyx": "Katress",
    "Elphidran": "Tombat",
    "Elphidran Aqua": "Rayhound",
    "Kelpsea": "Lunaris",
    "Kelpsea Ignis": "Lunaris",
    "Azurobe": "Rayhound",
    "Cryolinx": "Elphidran",
    "Blazehowl": "Kitsun",
    "Blazehowl Noct": "Dinossom",
    "Relaxaurus": "Incineram",
    "Relaxaurus Lux": "Incineram",
    "Broncherry": "Mozzarina",
    "Broncherry Aqua": "Dumud",
    "Petallia": "Broncherry",
    "Reptyro": "Bushi",
    "Ice Reptyro": "Incineram",
    "Kingpaca": "Blazehowl",
    "Ice Kingpaca": "Katress",
    "Mammorest": "Bushi",
    "Mammorest Cryst": "Bushi",
    "Wumpo": "Blazehowl",
    "Wumpo Botan": "Blazehowl",
    "Warsect": "Bushi",
    "Fenglope": "Loupmoon",
    "Felbat": "Fenglope",
    "Quivern": "Vanwyrm",
    "Blazamut": "Wumpo Botan",
    "Helzephyr": "Anubis",
    "Astegon": "Elphidran",
    "Menasting": "Incineram",
    "Anubis": "Foxcicle",
    "Jormuntide": "Bushi",
    "Jormuntide Ignis": "Bushi",
    "Suzaku": "Azurobe",
    "Suzaku Aqua": "Cinnamoth",
    "Grizzbolt": "Anubis",
    "Lyleen": "Incineram",
    "Lyleen Noct": "Anubis",
    "Faleris": "Vanwyrm",
    "Orserk": "Elphidran",
    "Shadowbeak": "Azurobe",
    "Paladius": "Penking",
    "Necromus": "Grintale",
    "Frostallion": "Elphidran",
    "Frostallion Noct": "Penking",
    "Jetragon": "Penking"
  },
  "Galeclaw": {
    "Lamball": "Tanzee",
    "Cattiva": "Tanzee",
    "Chikipi": "Kelpsea",
    "Lifmunk": "Daedream",
    "Foxparks": "Dazzi",
    "Fuack": "Nox",
    "Sparkit": "Fuddler",
    "Tanzee": "Rushoar",
    "Rooby": "Gobfin",
    "Pengullet": "Woolipop",
    "Penking": "Petallia",
    "Jolthog": "Dazzi",
    "Jolthog Cryst": "Woolipop",
    "Gumoss": "Rushoar",
    "Gumoss (Special)": "Rushoar",
    "Vixy": "Gumoss",
    "Hoocrates": "Dazzi",
    "Teafant": "Kelpsea",
    "Depresso": "Dazzi",
    "Cremis": "Gumoss",
    "Daedream": "Rushoar",
    "Rushoar": "Cawgnito",
    "Nox": "Lunaris",
    "Fuddler": "Rushoar",
    "Killamari": "Wixen",
    "Mau": "Kelpsea",
    "Mau Cryst": "Daedream",
    "Celaray": "Loupmoon",
    "Direhowl": "Gorirat",
    "Tocotoco": "Woolipop",
    "Flopie": "Rooby",
    "Mozzarina": "Fenglope",
    "Bristla": "Nox",
    "Gobfin": "Direhowl",
    "Gobfin Ignis": "Direhowl",
    "Hangyu": "Fuddler",
    "Hangyu Cryst": "Daedream",
    "Mossanda": "Rayhound",
    "Mossanda Lux": "Blazehowl",
    "Woolipop": "Lunaris",
    "Caprity": "Fenglope",
    "Melpaca": "Loupmoon",
    "Eikthyrdeer": "Fenglope",
    "Eikthyrdeer Terra": "Loupmoon",
    "Nitewing": "Rayhound",
    "Ribunny": "Wixen",
    "Incineram": "Dinossom",
    "Incineram Noct": "Chillet",
    "Cinnamoth": "Foxcicle",
    "Arsox": "Mozzarina",
    "Dumud": "Loupmoon",
    "Cawgnito": "Direhowl",
    "Leezpunk": "Cawgnito",
    "Leezpunk Ignis": "Gobfin",
    "Loupmoon": "Verdash",
    "Galeclaw": "Galeclaw",
    "Robinquill": "Galeclaw",
    "Robinquill Terra": "Robinquill",
    "Gorirat": "Galeclaw",
    "Beegarde": "Vaelet",
    "Elizabee": "Univolt",
    "Grintale": "Foxcicle",
    "Swee": "Wixen",
    "Sweepa": "Blazehowl",
    "Chillet": "Eikthyrdeer",
    "Univolt": "Digtoise",
    "Foxcicle": "Dumud",
    "Pyrin": "Katress",
    "Pyrin Noct": "Bushi",
    "Reindrix": "Loupmoon",
    "Rayhound": "Melpaca",
    "Kitsun": "Caprity",
    "Dazzi": "Leezpunk",
    "Lunaris": "Beegarde",
    "Dinossom": "Eikthyrdeer",
    "Dinossom Lux": "Eikthyrdeer",
    "Surfent": "Arsox",
    "Surfent Terra": "Arsox",
    "Maraith": "Gobfin",
    "Digtoise": "Lovander",
    "Tombat": "Melpaca",
    "Lovander": "Fenglope",
    "Flambelle": "Fuddler",
    "Vanwyrm": "Digtoise",
    "Vanwyrm Cryst": "Kitsun",
    "Bushi": "Kitsun",
    "Beakon": "Bushi",
    "Ragnahawk": "Blazehowl",
    "Katress": "Broncherry",
    "Wixen": "Gobfin",
    "Verdash": "Felbat",
    "Vaelet": "Gorirat",
    "Sibelyx": "Rayhound",
    "Elphidran": "Arsox",
    "Elphidran Aqua": "Petallia",
    "Kelpsea": "Maraith",
    "Kelpsea Ignis": "Maraith",
    "Azurobe": "Foxcicle",
    "Cryolinx": "Anubis",
    "Blazehowl": "Celaray",
    "Blazehowl Noct": "Digtoise",
    "Relaxaurus": "Vanwyrm",
    "Relaxaurus Lux": "Vanwyrm",
    "Broncherry": "Loupmoon",
    "Broncherry Aqua": "Caprity",
    "Petallia": "Mozzarina",
    "Reptyro": "Univolt",
    "Ice Reptyro": "Bushi",
    "Kingpaca": "Tombat",
    "Ice Kingpaca": "Rayhound",
    "Mammorest": "Vanwyrm",
    "Mammorest Cryst": "Vanwyrm",
    "Wumpo": "Tombat",
    "Wumpo Botan": "Tombat",
    "Warsect": "Univolt",
    "Fenglope": "Felbat",
    "Felbat": "Robinquill",
    "Quivern": "Univolt",
    "Blazamut": "Penking",
    "Helzephyr": "Incineram",
    "Astegon": "Incineram",
    "Menasting": "Bushi",
    "Anubis": "Chillet",
    "Jormuntide": "Univolt",
    "Jormuntide Ignis": "Univolt",
    "Suzaku": "Elphidran",
    "Suzaku Aqua": "Elphidran",
    "Grizzbolt": "Incineram",
    "Lyleen": "Bushi",
    "Lyleen Noct": "Bushi",
    "Faleris": "Katress",
    "Orserk": "Incineram",
    "Shadowbeak": "Elphidran",
    "Paladius": "Surfent",
    "Necromus": "Elphidran",
    "Frostallion": "Anubis",
    "Frostallion Noct": "Anubis",
    "Jetragon": "Surfent"
  },
  "Robinquill": {
    "Lamball": "Tanzee",
    "Cattiva": "Gumoss",
    "Chikipi": "Kelpsea",
    "Lifmunk": "Fuddler",
    "Foxparks": "Dazzi",
    "Fuack": "Nox",
    "Sparkit": "Dazzi",
    "Tanzee": "Rushoar",
    "Rooby": "Gobfin",
    "Pengullet": "Woolipop",
    "Penking": "Foxcicle",
    "Jolthog": "Woolipop",
    "Jolthog Cryst": "Woolipop",
    "Gumoss": "Rushoar",
    "Gumoss (Special)": "Rushoar",
    "Vixy": "Daedream",
    "Hoocrates": "Dazzi",
    "Teafant": "Kelpsea",
    "Depresso": "Dazzi",
    "Cremis": "Gumoss",
    "Daedream": "Rushoar",
    "Rushoar": "Cawgnito",
    "Nox": "Lunaris",
    "Fuddler": "Robinquill Terra",
    "Killamari": "Rooby",
    "Mau": "Tanzee",
    "Mau Cryst": "Daedream",
    "Celaray": "Loupmoon",
    "Direhowl": "Gorirat",
    "Tocotoco": "Nox",
    "Flopie": "Maraith",
    "Mozzarina": "Loupmoon",
    "Bristla": "Wixen",
    "Gobfin": "Direhowl",
    "Gobfin Ignis": "Direhowl",
    "Hangyu": "Fuddler",
    "Hangyu Cryst": "Fuddler",
    "Mossanda": "Rayhound",
    "Mossanda Lux": "Blazehowl",
    "Woolipop": "Lunaris",
    "Caprity": "Fenglope",
    "Melpaca": "Loupmoon",
    "Eikthyrdeer": "Fenglope",
    "Eikthyrdeer Terra": "Loupmoon",
    "Nitewing": "Blazehowl",
    "Ribunny": "Wixen",
    "Incineram": "Chillet",
    "Incineram Noct": "Chillet",
    "Cinnamoth": "Tombat",
    "Arsox": "Mozzarina",
    "Dumud": "Loupmoon",
    "Cawgnito": "Vaelet",
    "Leezpunk": "Beegarde",
    "Leezpunk Ignis": "Cawgnito",
    "Loupmoon": "Fenglope",
    "Galeclaw": "Galeclaw",
    "Robinquill": "Robinquill",
    "Robinquill Terra": "Felbat",
    "Gorirat": "Galeclaw",
    "Beegarde": "Gorirat",
    "Elizabee": "Univolt",
    "Grintale": "Foxcicle",
    "Swee": "Wixen",
    "Sweepa": "Blazehowl",
    "Chillet": "Mozzarina",
    "Univolt": "Digtoise",
    "Foxcicle": "Melpaca",
    "Pyrin": "Univolt",
    "Pyrin Noct": "Bushi",
    "Reindrix": "Loupmoon",
    "Rayhound": "Reindrix",
    "Kitsun": "Eikthyrdeer",
    "Dazzi": "Lunaris",
    "Lunaris": "Direhowl",
    "Dinossom": "Eikthyrdeer",
    "Dinossom Lux": "Eikthyrdeer",
    "Surfent": "Arsox",
    "Surfent Terra": "Arsox",
    "Maraith": "Gobfin",
    "Digtoise": "Caprity",
    "Tombat": "Melpaca",
    "Lovander": "Fenglope",
    "Flambelle": "Dazzi",
    "Vanwyrm": "Digtoise",
    "Vanwyrm Cryst": "Dinossom",
    "Bushi": "Kitsun",
    "Beakon": "Bushi",
    "Ragnahawk": "Katress",
    "Katress": "Broncherry",
    "Wixen": "Gobfin",
    "Verdash": "Felbat",
    "Vaelet": "Galeclaw",
    "Sibelyx": "Rayhound",
    "Elphidran": "Petallia",
    "Elphidran Aqua": "Petallia",
    "Kelpsea": "Rushoar",
    "Kelpsea Ignis": "Maraith",
    "Azurobe": "Foxcicle",
    "Cryolinx": "Anubis",
    "Blazehowl": "Broncherry",
    "Blazehowl Noct": "Digtoise",
    "Relaxaurus": "Vanwyrm",
    "Relaxaurus Lux": "Bushi",
    "Broncherry": "Lovander",
    "Broncherry Aqua": "Caprity",
    "Petallia": "Dumud",
    "Reptyro": "Univolt",
    "Ice Reptyro": "Bushi",
    "Kingpaca": "Tombat",
    "Ice Kingpaca": "Rayhound",
    "Mammorest": "Vanwyrm",
    "Mammorest Cryst": "Vanwyrm",
    "Wumpo": "Rayhound",
    "Wumpo Botan": "Tombat",
    "Warsect": "Univolt",
    "Fenglope": "Felbat",
    "Felbat": "Robinquill",
    "Quivern": "Univolt",
    "Blazamut": "Penking",
    "Helzephyr": "Incineram",
    "Astegon": "Incineram",
    "Menasting": "Bushi",
    "Anubis": "Arsox",
    "Jormuntide": "Vanwyrm",
    "Jormuntide Ignis": "Vanwyrm",
    "Suzaku": "Elphidran",
    "Suzaku Aqua": "Penking",
    "Grizzbolt": "Incineram",
    "Lyleen": "Bushi",
    "Lyleen Noct": "Incineram",
    "Faleris": "Katress",
    "Orserk": "Anubis",
    "Shadowbeak": "Elphidran",
    "Paladius": "Elphidran",
    "Necromus": "Elphidran",
    "Frostallion": "Anubis",
    "Frostallion Noct": "Surfent",
    "Jetragon": "Surfent"
  },
  "Robinquill Terra": {
    "variant": true,
    "Lamball": "Daedream",
    "Cattiva": "Daedream",
    "Chikipi": "Tanzee",
    "Lifmunk": "Dazzi",
    "Foxparks": "Dazzi",
    "Fuack": "Wixen",
    "Sparkit": "Dazzi",
    "Tanzee": "Rushoar",
    "Rooby": "Cawgnito",
    "Pengullet": "Nox",
    "Penking": "Foxcicle",
    "Jolthog": "Woolipop",
    "Jolthog Cryst": "Nox",
    "Gumoss": "Leezpunk",
    "Gumoss (Special)": "Leezpunk",
    "Vixy": "Fuddler",
    "Hoocrates": "Woolipop",
    "Teafant": "Tanzee",
    "Depresso": "Woolipop",
    "Cremis": "Daedream",
    "Daedream": "Lunaris",
    "Rushoar": "Direhowl",
    "Nox": "Gobfin",
    "Fuddler": "Lunaris",
    "Killamari": "Maraith",
    "Mau": "Gumoss",
    "Mau Cryst": "Fuddler",
    "Celaray": "Caprity",
    "Direhowl": "Galeclaw",
    "Tocotoco": "Wixen",
    "Flopie": "Rushoar",
    "Mozzarina": "Loupmoon",
    "Bristla": "Wixen",
    "Gobfin": "Gorirat",
    "Gobfin Ignis": "Vaelet",
    "Hangyu": "Dazzi",
    "Hangyu Cryst": "Dazzi",
    "Mossanda": "Blazehowl",
    "Mossanda Lux": "Katress",
    "Woolipop": "Gobfin",
    "Caprity": "Loupmoon",
    "Melpaca": "Loupmoon",
    "Eikthyrdeer": "Loupmoon",
    "Eikthyrdeer Terra": "Loupmoon",
    "Nitewing": "Blazehowl",
    "Ribunny": "Rooby",
    "Incineram": "Arsox",
    "Incineram Noct": "Arsox",
    "Cinnamoth": "Tombat",
    "Arsox": "Dumud",
    "Dumud": "Loupmoon",
    "Cawgnito": "Gorirat",
    "Leezpunk": "Direhowl",
    "Leezpunk Ignis": "Beegarde",
    "Loupmoon": "Fenglope",
    "Galeclaw": "Robinquill",
    "Robinquill": "Felbat",
    "Robinquill Terra": "Robinquill Terra",
    "Gorirat": "Robinquill",
    "Beegarde": "Galeclaw",
    "Elizabee": "Vanwyrm",
    "Grintale": "Tombat",
    "Swee": "Maraith",
    "Sweepa": "Blazehowl",
    "Chillet": "Dumud",
    "Univolt": "Digtoise",
    "Foxcicle": "Reindrix",
    "Pyrin": "Univolt",
    "Pyrin Noct": "Bushi",
    "Reindrix": "Lovander",
    "Rayhound": "Celaray",
    "Kitsun": "Eikthyrdeer",
    "Dazzi": "Lunaris",
    "Lunaris": "Direhowl",
    "Dinossom": "Mozzarina",
    "Dinossom Lux": "Mozzarina",
    "Surfent": "Petallia",
    "Surfent Terra": "Petallia",
    "Maraith": "Cawgnito",
    "Digtoise": "Eikthyrdeer",
    "Tombat": "Reindrix",
    "Lovander": "Fenglope",
    "Flambelle": "Dazzi",
    "Vanwyrm": "Kitsun",
    "Vanwyrm Cryst": "Dinossom",
    "Bushi": "Dinossom",
    "Beakon": "Incineram",
    "Ragnahawk": "Univolt",
    "Katress": "Digtoise",
    "Wixen": "Cawgnito",
    "Verdash": "Verdash",
    "Vaelet": "Galeclaw",
    "Sibelyx": "Rayhound",
    "Elphidran": "Foxcicle",
    "Elphidran Aqua": "Foxcicle",
    "Kelpsea": "Rushoar",
    "Kelpsea Ignis": "Rushoar",
    "Azurobe": "Tombat",
    "Cryolinx": "Anubis",
    "Blazehowl": "Digtoise",
    "Blazehowl Noct": "Kitsun",
    "Relaxaurus": "Bushi",
    "Relaxaurus Lux": "Bushi",
    "Broncherry": "Caprity",
    "Broncherry Aqua": "Eikthyrdeer",
    "Petallia": "Melpaca",
    "Reptyro": "Vanwyrm",
    "Ice Reptyro": "Incineram",
    "Kingpaca": "Rayhound",
    "Ice Kingpaca": "Blazehowl",
    "Mammorest": "Vanwyrm",
    "Mammorest Cryst": "Bushi",
    "Wumpo": "Rayhound",
    "Wumpo Botan": "Rayhound",
    "Warsect": "Univolt",
    "Fenglope": "Verdash",
    "Felbat": "Felbat",
    "Quivern": "Univolt",
    "Blazamut": "Azurobe",
    "Helzephyr": "Incineram",
    "Astegon": "Anubis",
    "Menasting": "Bushi",
    "Anubis": "Arsox",
    "Jormuntide": "Vanwyrm",
    "Jormuntide Ignis": "Vanwyrm",
    "Suzaku": "Penking",
    "Suzaku Aqua": "Penking",
    "Grizzbolt": "Incineram",
    "Lyleen": "Bushi",
    "Lyleen Noct": "Incineram",
    "Faleris": "Univolt",
    "Orserk": "Anubis",
    "Shadowbeak": "Elphidran",
    "Paladius": "Elphidran",
    "Necromus": "Elphidran",
    "Frostallion": "Surfent",
    "Frostallion Noct": "Elphidran",
    "Jetragon": "Elphidran"
  },
  "Gorirat": {
    "Lamball": "Kelpsea",
    "Cattiva": "Tanzee",
    "Chikipi": "Kelpsea Ignis",
    "Lifmunk": "Daedream",
    "Foxparks": "Fuddler",
    "Fuack": "Woolipop",
    "Sparkit": "Fuddler",
    "Tanzee": "Maraith",
    "Rooby": "Gobfin",
    "Pengullet": "Woolipop",
    "Penking": "Petallia",
    "Jolthog": "Dazzi",
    "Jolthog Cryst": "Dazzi",
    "Gumoss": "Rushoar",
    "Gumoss (Special)": "Rushoar",
    "Vixy": "Tanzee",
    "Hoocrates": "Dazzi",
    "Teafant": "Kelpsea",
    "Depresso": "Dazzi",
    "Cremis": "Tanzee",
    "Daedream": "Rushoar",
    "Rushoar": "Gobfin",
    "Nox": "Lunaris",
    "Fuddler": "Rushoar",
    "Killamari": "Wixen",
    "Mau": "Kelpsea",
    "Mau Cryst": "Gumoss",
    "Celaray": "Loupmoon",
    "Direhowl": "Vaelet",
    "Tocotoco": "Woolipop",
    "Flopie": "Wixen",
    "Mozzarina": "Fenglope",
    "Bristla": "Nox",
    "Gobfin": "Direhowl",
    "Gobfin Ignis": "Beegarde",
    "Hangyu": "Daedream",
    "Hangyu Cryst": "Daedream",
    "Mossanda": "Rayhound",
    "Mossanda Lux": "Blazehowl",
    "Woolipop": "Lunaris",
    "Caprity": "Fenglope",
    "Melpaca": "Loupmoon",
    "Eikthyrdeer": "Fenglope",
    "Eikthyrdeer Terra": "Fenglope",
    "Nitewing": "Rayhound",
    "Ribunny": "Nox",
    "Incineram": "Dinossom",
    "Incineram Noct": "Dinossom",
    "Cinnamoth": "Foxcicle",
    "Arsox": "Eikthyrdeer",
    "Dumud": "Fenglope",
    "Cawgnito": "Direhowl",
    "Leezpunk": "Cawgnito",
    "Leezpunk Ignis": "Gobfin",
    "Loupmoon": "Verdash",
    "Galeclaw": "Galeclaw",
    "Robinquill": "Galeclaw",
    "Robinquill Terra": "Robinquill",
    "Gorirat": "Gorirat",
    "Beegarde": "Direhowl",
    "Elizabee": "Univolt",
    "Grintale": "Petallia",
    "Swee": "Wixen",
    "Sweepa": "Rayhound",
    "Chillet": "Eikthyrdeer",
    "Univolt": "Broncherry",
    "Foxcicle": "Dumud",
    "Pyrin": "Katress",
    "Pyrin Noct": "Bushi",
    "Reindrix": "Loupmoon",
    "Rayhound": "Melpaca",
    "Kitsun": "Caprity",
    "Dazzi": "Rushoar",
    "Lunaris": "Cawgnito",
    "Dinossom": "Caprity",
    "Dinossom Lux": "Eikthyrdeer",
    "Surfent": "Chillet",
    "Surfent Terra": "Arsox",
    "Maraith": "Gobfin",
    "Digtoise": "Loupmoon",
    "Tombat": "Dumud",
    "Lovander": "Verdash",
    "Flambelle": "Fuddler",
    "Vanwyrm": "Digtoise",
    "Vanwyrm Cryst": "Kitsun",
    "Bushi": "Digtoise",
    "Beakon": "Bushi",
    "Ragnahawk": "Blazehowl",
    "Katress": "Celaray",
    "Wixen": "Lunaris",
    "Verdash": "Robinquill",
    "Vaelet": "Gorirat",
    "Sibelyx": "Tombat",
    "Elphidran": "Arsox",
    "Elphidran Aqua": "Arsox",
    "Kelpsea": "Maraith",
    "Kelpsea Ignis": "Rooby",
    "Azurobe": "Foxcicle",
    "Cryolinx": "Incineram",
    "Blazehowl": "Reindrix",
    "Blazehowl Noct": "Digtoise",
    "Relaxaurus": "Vanwyrm",
    "Relaxaurus Lux": "Vanwyrm",
    "Broncherry": "Loupmoon",
    "Broncherry Aqua": "Lovander",
    "Petallia": "Mozzarina",
    "Reptyro": "Univolt",
    "Ice Reptyro": "Bushi",
    "Kingpaca": "Tombat",
    "Ice Kingpaca": "Rayhound",
    "Mammorest": "Univolt",
    "Mammorest Cryst": "Vanwyrm",
    "Wumpo": "Tombat",
    "Wumpo Botan": "Foxcicle",
    "Warsect": "Univolt",
    "Fenglope": "Felbat",
    "Felbat": "Galeclaw",
    "Quivern": "Katress",
    "Blazamut": "Penking",
    "Helzephyr": "Incineram",
    "Astegon": "Incineram",
    "Menasting": "Vanwyrm",
    "Anubis": "Chillet",
    "Jormuntide": "Univolt",
    "Jormuntide Ignis": "Univolt",
    "Suzaku": "Elphidran",
    "Suzaku Aqua": "Elphidran",
    "Grizzbolt": "Bushi",
    "Lyleen": "Bushi",
    "Lyleen Noct": "Bushi",
    "Faleris": "Blazehowl",
    "Orserk": "Incineram",
    "Shadowbeak": "Elphidran",
    "Paladius": "Surfent",
    "Necromus": "Surfent",
    "Frostallion": "Anubis",
    "Frostallion Noct": "Anubis",
    "Jetragon": "Anubis"
  },
  "Beegarde": {
    "Lamball": "Kelpsea Ignis",
    "Cattiva": "Kelpsea",
    "Chikipi": "Killamari",
    "Lifmunk": "Tanzee",
    "Foxparks": "Daedream",
    "Fuack": "Dazzi",
    "Sparkit": "Gumoss",
    "Tanzee": "Wixen",
    "Rooby": "Lunaris",
    "Pengullet": "Dazzi",
    "Penking": "Arsox",
    "Jolthog": "Fuddler",
    "Jolthog Cryst": "Dazzi",
    "Gumoss": "Rooby",
    "Gumoss (Special)": "Rooby",
    "Vixy": "Kelpsea",
    "Hoocrates": "Daedream",
    "Teafant": "Flopie",
    "Depresso": "Fuddler",
    "Cremis": "Kelpsea",
    "Daedream": "Maraith",
    "Rushoar": "Lunaris",
    "Nox": "Rushoar",
    "Fuddler": "Maraith",
    "Killamari": "Nox",
    "Mau": "Kelpsea Ignis",
    "Mau Cryst": "Kelpsea",
    "Celaray": "Fenglope",
    "Direhowl": "Direhowl",
    "Tocotoco": "Dazzi",
    "Flopie": "Nox",
    "Mozzarina": "Verdash",
    "Bristla": "Woolipop",
    "Gobfin": "Cawgnito",
    "Gobfin Ignis": "Gobfin",
    "Hangyu": "Tanzee",
    "Hangyu Cryst": "Tanzee",
    "Mossanda": "Tombat",
    "Mossanda Lux": "Rayhound",
    "Woolipop": "Rushoar",
    "Caprity": "Felbat",
    "Melpaca": "Fenglope",
    "Eikthyrdeer": "Verdash",
    "Eikthyrdeer Terra": "Fenglope",
    "Nitewing": "Tombat",
    "Ribunny": "Woolipop",
    "Incineram": "Kitsun",
    "Incineram Noct": "Kitsun",
    "Cinnamoth": "Petallia",
    "Arsox": "Caprity",
    "Dumud": "Fenglope",
    "Cawgnito": "Cawgnito",
    "Leezpunk": "Gobfin",
    "Leezpunk Ignis": "Lunaris",
    "Loupmoon": "Felbat",
    "Galeclaw": "Vaelet",
    "Robinquill": "Gorirat",
    "Robinquill Terra": "Galeclaw",
    "Gorirat": "Direhowl",
    "Beegarde": "Beegarde",
    "Elizabee": "Katress",
    "Grintale": "Arsox",
    "Swee": "Woolipop",
    "Sweepa": "Rayhound",
    "Chillet": "Caprity",
    "Univolt": "Reindrix",
    "Foxcicle": "Eikthyrdeer",
    "Pyrin": "Blazehowl",
    "Pyrin Noct": "Vanwyrm",
    "Reindrix": "Fenglope",
    "Rayhound": "Mozzarina",
    "Kitsun": "Loupmoon",
    "Dazzi": "Rushoar",
    "Lunaris": "Gobfin",
    "Dinossom": "Loupmoon",
    "Dinossom Lux": "Lovander",
    "Surfent": "Dinossom",
    "Surfent Terra": "Dinossom",
    "Maraith": "Lunaris",
    "Digtoise": "Loupmoon",
    "Tombat": "Mozzarina",
    "Lovander": "Felbat",
    "Flambelle": "Gumoss",
    "Vanwyrm": "Broncherry",
    "Vanwyrm Cryst": "Digtoise",
    "Bushi": "Digtoise",
    "Beakon": "Bushi",
    "Ragnahawk": "Rayhound",
    "Katress": "Melpaca",
    "Wixen": "Lunaris",
    "Verdash": "Galeclaw",
    "Vaelet": "Direhowl",
    "Sibelyx": "Foxcicle",
    "Elphidran": "Chillet",
    "Elphidran Aqua": "Chillet",
    "Kelpsea": "Wixen",
    "Kelpsea Ignis": "Wixen",
    "Azurobe": "Arsox",
    "Cryolinx": "Incineram",
    "Blazehowl": "Melpaca",
    "Blazehowl Noct": "Celaray",
    "Relaxaurus": "Univolt",
    "Relaxaurus Lux": "Univolt",
    "Broncherry": "Loupmoon",
    "Broncherry Aqua": "Loupmoon",
    "Petallia": "Eikthyrdeer",
    "Reptyro": "Katress",
    "Ice Reptyro": "Vanwyrm",
    "Kingpaca": "Foxcicle",
    "Ice Kingpaca": "Tombat",
    "Mammorest": "Univolt",
    "Mammorest Cryst": "Univolt",
    "Wumpo": "Foxcicle",
    "Wumpo Botan": "Petallia",
    "Warsect": "Blazehowl",
    "Fenglope": "Galeclaw",
    "Felbat": "Gorirat",
    "Quivern": "Blazehowl",
    "Blazamut": "Elphidran",
    "Helzephyr": "Bushi",
    "Astegon": "Incineram",
    "Menasting": "Vanwyrm",
    "Anubis": "Dinossom",
    "Jormuntide": "Univolt",
    "Jormuntide Ignis": "Katress",
    "Suzaku": "Surfent",
    "Suzaku Aqua": "Elphidran",
    "Grizzbolt": "Bushi",
    "Lyleen": "Vanwyrm",
    "Lyleen Noct": "Bushi",
    "Faleris": "Blazehowl",
    "Orserk": "Incineram",
    "Shadowbeak": "Anubis",
    "Paladius": "Anubis",
    "Necromus": "Anubis",
    "Frostallion": "Incineram",
    "Frostallion Noct": "Incineram",
    "Jetragon": "Anubis"
  },
  "Elizabee": {
    "Lamball": "Dumud",
    "Cattiva": "Dumud",
    "Chikipi": "Eikthyrdeer",
    "Lifmunk": "Reindrix",
    "Foxparks": "Broncherry",
    "Fuack": "Kitsun",
    "Sparkit": "Celaray",
    "Tanzee": "Arsox",
    "Rooby": "Rayhound",
    "Pengullet": "Digtoise",
    "Penking": "Nitewing",
    "Jolthog": "Digtoise",
    "Jolthog Cryst": "Digtoise",
    "Gumoss": "Arsox",
    "Gumoss (Special)": "Arsox",
    "Vixy": "Melpaca",
    "Hoocrates": "Broncherry",
    "Teafant": "Mozzarina",
    "Depresso": "Digtoise",
    "Cremis": "Dumud",
    "Daedream": "Petallia",
    "Rushoar": "Rayhound",
    "Nox": "Tombat",
    "Fuddler": "Petallia",
    "Killamari": "Dinossom",
    "Mau": "Mozzarina",
    "Mau Cryst": "Melpaca",
    "Celaray": "Incineram",
    "Direhowl": "Katress",
    "Tocotoco": "Kitsun",
    "Flopie": "Chillet",
    "Mozzarina": "Bushi",
    "Bristla": "Kitsun",
    "Gobfin": "Blazehowl",
    "Gobfin Ignis": "Blazehowl",
    "Hangyu": "Reindrix",
    "Hangyu Cryst": "Reindrix",
    "Mossanda": "Ragnahawk",
    "Mossanda Lux": "Pyrin",
    "Woolipop": "Foxcicle",
    "Caprity": "Bushi",
    "Melpaca": "Incineram",
    "Eikthyrdeer": "Bushi",
    "Eikthyrdeer Terra": "Incineram",
    "Nitewing": "Ragnahawk",
    "Ribunny": "Dinossom",
    "Incineram": "Wumpo",
    "Incineram Noct": "Sibelyx",
    "Cinnamoth": "Sweepa",
    "Arsox": "Surfent",
    "Dumud": "Incineram",
    "Cawgnito": "Blazehowl",
    "Leezpunk": "Rayhound",
    "Leezpunk Ignis": "Rayhound",
    "Loupmoon": "Bushi",
    "Galeclaw": "Univolt",
    "Robinquill": "Univolt",
    "Robinquill Terra": "Vanwyrm",
    "Gorirat": "Univolt",
    "Beegarde": "Katress",
    "Elizabee": "Elizabee",
    "Grintale": "Nitewing",
    "Swee": "Dinossom",
    "Sweepa": "Pyrin",
    "Chillet": "Anubis",
    "Univolt": "Azurobe",
    "Foxcicle": "Elphidran",
    "Pyrin": "Warsect",
    "Pyrin Noct": "Relaxaurus",
    "Reindrix": "Incineram",
    "Rayhound": "Elphidran",
    "Kitsun": "Anubis",
    "Dazzi": "Foxcicle",
    "Lunaris": "Blazehowl",
    "Dinossom": "Anubis",
    "Dinossom Lux": "Anubis",
    "Surfent": "Sibelyx",
    "Surfent Terra": "Sibelyx",
    "Maraith": "Rayhound",
    "Digtoise": "Incineram",
    "Tombat": "Elphidran",
    "Lovander": "Bushi",
    "Flambelle": "Celaray",
    "Vanwyrm": "Azurobe",
    "Vanwyrm Cryst": "Wumpo Botan",
    "Bushi": "Wumpo Botan",
    "Beakon": "Relaxaurus",
    "Ragnahawk": "Pyrin",
    "Katress": "Penking",
    "Wixen": "Tombat",
    "Verdash": "Vanwyrm",
    "Vaelet": "Univolt",
    "Sibelyx": "Ragnahawk",
    "Elphidran": "Mossanda",
    "Elphidran Aqua": "Mossanda",
    "Kelpsea": "Arsox",
    "Kelpsea Ignis": "Chillet",
    "Azurobe": "Nitewing",
    "Cryolinx": "Beakon",
    "Blazehowl": "Penking",
    "Blazehowl Noct": "Azurobe",
    "Relaxaurus": "Jormuntide",
    "Relaxaurus Lux": "Mammorest",
    "Broncherry": "Incineram",
    "Broncherry Aqua": "Incineram",
    "Petallia": "Surfent",
    "Reptyro": "Reptyro",
    "Ice Reptyro": "Relaxaurus",
    "Kingpaca": "Sweepa",
    "Ice Kingpaca": "Ragnahawk",
    "Mammorest": "Jormuntide",
    "Mammorest Cryst": "Jormuntide",
    "Wumpo": "Sweepa",
    "Wumpo Botan": "Sweepa",
    "Warsect": "Elizabee",
    "Fenglope": "Vanwyrm",
    "Felbat": "Univolt",
    "Quivern": "Warsect",
    "Blazamut": "Astegon",
    "Helzephyr": "Menasting",
    "Astegon": "Beakon",
    "Menasting": "Mammorest",
    "Anubis": "Sibelyx",
    "Jormuntide": "Reptyro",
    "Jormuntide Ignis": "Reptyro",
    "Suzaku": "Helzephyr",
    "Suzaku Aqua": "Helzephyr",
    "Grizzbolt": "Menasting",
    "Lyleen": "Relaxaurus",
    "Lyleen Noct": "Relaxaurus",
    "Faleris": "Quivern",
    "Orserk": "Beakon",
    "Shadowbeak": "Helzephyr",
    "Paladius": "Beakon",
    "Necromus": "Helzephyr",
    "Frostallion": "Beakon",
    "Frostallion Noct": "Beakon",
    "Jetragon": "Beakon"
  },
  "Grintale": {
    "Lamball": "Verdash",
    "Cattiva": "Fenglope",
    "Chikipi": "Felbat",
    "Lifmunk": "Fenglope",
    "Foxparks": "Loupmoon",
    "Fuack": "Eikthyrdeer",
    "Sparkit": "Loupmoon",
    "Tanzee": "Reindrix",
    "Rooby": "Kitsun",
    "Pengullet": "Caprity",
    "Penking": "Penking",
    "Jolthog": "Lovander",
    "Jolthog Cryst": "Caprity",
    "Gumoss": "Reindrix",
    "Gumoss (Special)": "Reindrix",
    "Vixy": "Fenglope",
    "Hoocrates": "Loupmoon",
    "Teafant": "Felbat",
    "Depresso": "Loupmoon",
    "Cremis": "Fenglope",
    "Daedream": "Celaray",
    "Rushoar": "Dinossom",
    "Nox": "Digtoise",
    "Fuddler": "Broncherry",
    "Killamari": "Dumud",
    "Mau": "Verdash",
    "Mau Cryst": "Fenglope",
    "Celaray": "Univolt",
    "Direhowl": "Arsox",
    "Tocotoco": "Eikthyrdeer",
    "Flopie": "Dumud",
    "Mozzarina": "Blazehowl",
    "Bristla": "Eikthyrdeer",
    "Gobfin": "Chillet",
    "Gobfin Ignis": "Chillet",
    "Hangyu": "Loupmoon",
    "Hangyu Cryst": "Fenglope",
    "Mossanda": "Kingpaca",
    "Mossanda Lux": "Sibelyx",
    "Woolipop": "Digtoise",
    "Caprity": "Blazehowl",
    "Melpaca": "Katress",
    "Eikthyrdeer": "Blazehowl",
    "Eikthyrdeer Terra": "Blazehowl",
    "Nitewing": "Wumpo",
    "Ribunny": "Mozzarina",
    "Incineram": "Elphidran",
    "Incineram Noct": "Elphidran",
    "Cinnamoth": "Azurobe",
    "Arsox": "Vanwyrm",
    "Dumud": "Katress",
    "Cawgnito": "Arsox",
    "Leezpunk": "Dinossom",
    "Leezpunk Ignis": "Kitsun",
    "Loupmoon": "Rayhound",
    "Galeclaw": "Foxcicle",
    "Robinquill": "Foxcicle",
    "Robinquill Terra": "Tombat",
    "Gorirat": "Petallia",
    "Beegarde": "Arsox",
    "Elizabee": "Nitewing",
    "Grintale": "Grintale",
    "Swee": "Mozzarina",
    "Sweepa": "Wumpo",
    "Chillet": "Vanwyrm",
    "Univolt": "Incineram",
    "Foxcicle": "Bushi",
    "Pyrin": "Mossanda",
    "Pyrin Noct": "Ragnahawk",
    "Reindrix": "Katress",
    "Rayhound": "Bushi",
    "Kitsun": "Univolt",
    "Dazzi": "Broncherry",
    "Lunaris": "Dinossom",
    "Dinossom": "Vanwyrm",
    "Dinossom Lux": "Vanwyrm",
    "Surfent": "Elphidran",
    "Surfent Terra": "Elphidran",
    "Maraith": "Kitsun",
    "Digtoise": "Univolt",
    "Tombat": "Bushi",
    "Lovander": "Rayhound",
    "Flambelle": "Loupmoon",
    "Vanwyrm": "Incineram",
    "Vanwyrm Cryst": "Anubis",
    "Bushi": "Anubis",
    "Beakon": "Pyrin",
    "Ragnahawk": "Sibelyx",
    "Katress": "Incineram",
    "Wixen": "Kitsun",
    "Verdash": "Tombat",
    "Vaelet": "Petallia",
    "Sibelyx": "Wumpo Botan",
    "Elphidran": "Penking",
    "Elphidran Aqua": "Penking",
    "Kelpsea": "Melpaca",
    "Kelpsea Ignis": "Melpaca",
    "Azurobe": "Azurobe",
    "Cryolinx": "Reptyro",
    "Blazehowl": "Incineram",
    "Blazehowl Noct": "Incineram",
    "Relaxaurus": "Sweepa",
    "Relaxaurus Lux": "Ragnahawk",
    "Broncherry": "Univolt",
    "Broncherry Aqua": "Univolt",
    "Petallia": "Bushi",
    "Reptyro": "Nitewing",
    "Ice Reptyro": "Pyrin",
    "Kingpaca": "Cinnamoth",
    "Ice Kingpaca": "Wumpo Botan",
    "Mammorest": "Sweepa",
    "Mammorest Cryst": "Sweepa",
    "Wumpo": "Wumpo Botan",
    "Wumpo Botan": "Azurobe",
    "Warsect": "Nitewing",
    "Fenglope": "Tombat",
    "Felbat": "Foxcicle",
    "Quivern": "Mossanda",
    "Blazamut": "Menasting",
    "Helzephyr": "Quivern",
    "Astegon": "Elizabee",
    "Menasting": "Ragnahawk",
    "Anubis": "Elphidran",
    "Jormuntide": "Sweepa",
    "Jormuntide Ignis": "Sweepa",
    "Suzaku": "Relaxaurus",
    "Suzaku Aqua": "Relaxaurus",
    "Grizzbolt": "Pyrin",
    "Lyleen": "Ragnahawk",
    "Lyleen Noct": "Pyrin",
    "Faleris": "Sibelyx",
    "Orserk": "Reptyro",
    "Shadowbeak": "Relaxaurus",
    "Paladius": "Mammorest",
    "Necromus": "Relaxaurus",
    "Frostallion": "Jormuntide",
    "Frostallion Noct": "Jormuntide",
    "Jetragon": "Mammorest"
  },
  "Swee": {
    "Lamball": "Depresso",
    "Cattiva": "Depresso",
    "Chikipi": "Foxparks",
    "Lifmunk": "Jolthog",
    "Foxparks": "Pengullet",
    "Fuack": "Bristla",
    "Sparkit": "Pengullet",
    "Tanzee": "Kelpsea Ignis",
    "Rooby": "Daedream",
    "Pengullet": "Bristla",
    "Penking": "Mozzarina",
    "Jolthog": "Tocotoco",
    "Jolthog Cryst": "Fuack",
    "Gumoss": "Kelpsea Ignis",
    "Gumoss (Special)": "Kelpsea Ignis",
    "Vixy": "Jolthog",
    "Hoocrates": "Tocotoco",
    "Teafant": "Foxparks",
    "Depresso": "Tocotoco",
    "Cremis": "Depresso",
    "Daedream": "Kelpsea",
    "Rushoar": "Dazzi",
    "Nox": "Gumoss",
    "Fuddler": "Kelpsea",
    "Killamari": "Killamari",
    "Mau": "Hoocrates",
    "Mau Cryst": "Jolthog",
    "Celaray": "Gobfin",
    "Direhowl": "Nox",
    "Tocotoco": "Bristla",
    "Flopie": "Killamari",
    "Mozzarina": "Lunaris",
    "Bristla": "Ribunny",
    "Gobfin": "Woolipop",
    "Gobfin Ignis": "Dazzi",
    "Hangyu": "Hangyu Cryst",
    "Hangyu Cryst": "Jolthog",
    "Mossanda": "Broncherry",
    "Mossanda Lux": "Digtoise",
    "Woolipop": "Tanzee",
    "Caprity": "Lunaris",
    "Melpaca": "Gobfin",
    "Eikthyrdeer": "Lunaris",
    "Eikthyrdeer Terra": "Lunaris",
    "Nitewing": "Broncherry",
    "Ribunny": "Swee",
    "Incineram": "Loupmoon",
    "Incineram Noct": "Lovander",
    "Cinnamoth": "Dumud",
    "Arsox": "Gorirat",
    "Dumud": "Gobfin",
    "Cawgnito": "Woolipop",
    "Leezpunk": "Dazzi",
    "Leezpunk Ignis": "Fuddler",
    "Loupmoon": "Rushoar",
    "Galeclaw": "Wixen",
    "Robinquill": "Wixen",
    "Robinquill Terra": "Maraith",
    "Gorirat": "Wixen",
    "Beegarde": "Woolipop",
    "Elizabee": "Dinossom",
    "Grintale": "Mozzarina",
    "Swee": "Swee",
    "Sweepa": "Digtoise",
    "Chillet": "Vaelet",
    "Univolt": "Verdash",
    "Foxcicle": "Galeclaw",
    "Pyrin": "Kitsun",
    "Pyrin Noct": "Foxcicle",
    "Reindrix": "Gobfin",
    "Rayhound": "Robinquill",
    "Kitsun": "Direhowl",
    "Dazzi": "Kelpsea",
    "Lunaris": "Dazzi",
    "Dinossom": "Direhowl",
    "Dinossom Lux": "Direhowl",
    "Surfent": "Caprity",
    "Surfent Terra": "Eikthyrdeer",
    "Maraith": "Fuddler",
    "Digtoise": "Cawgnito",
    "Tombat": "Galeclaw",
    "Lovander": "Leezpunk",
    "Flambelle": "Pengullet",
    "Vanwyrm": "Fenglope",
    "Vanwyrm Cryst": "Loupmoon",
    "Bushi": "Fenglope",
    "Beakon": "Foxcicle",
    "Ragnahawk": "Digtoise",
    "Katress": "Felbat",
    "Wixen": "Daedream",
    "Verdash": "Maraith",
    "Vaelet": "Nox",
    "Sibelyx": "Reindrix",
    "Elphidran": "Eikthyrdeer",
    "Elphidran Aqua": "Eikthyrdeer",
    "Kelpsea": "Flopie",
    "Kelpsea Ignis": "Killamari",
    "Azurobe": "Dumud",
    "Cryolinx": "Blazehowl",
    "Blazehowl": "Felbat",
    "Blazehowl Noct": "Fenglope",
    "Relaxaurus": "Arsox",
    "Relaxaurus Lux": "Arsox",
    "Broncherry": "Cawgnito",
    "Broncherry Aqua": "Beegarde",
    "Petallia": "Gorirat",
    "Reptyro": "Dinossom",
    "Ice Reptyro": "Foxcicle",
    "Kingpaca": "Melpaca",
    "Ice Kingpaca": "Celaray",
    "Mammorest": "Chillet",
    "Mammorest Cryst": "Arsox",
    "Wumpo": "Reindrix",
    "Wumpo Botan": "Melpaca",
    "Warsect": "Dinossom",
    "Fenglope": "Rushoar",
    "Felbat": "Rooby",
    "Quivern": "Kitsun",
    "Blazamut": "Vanwyrm",
    "Helzephyr": "Tombat",
    "Astegon": "Rayhound",
    "Menasting": "Petallia",
    "Anubis": "Caprity",
    "Jormuntide": "Chillet",
    "Jormuntide Ignis": "Chillet",
    "Suzaku": "Univolt",
    "Suzaku Aqua": "Vanwyrm",
    "Grizzbolt": "Tombat",
    "Lyleen": "Petallia",
    "Lyleen Noct": "Tombat",
    "Faleris": "Kitsun",
    "Orserk": "Blazehowl",
    "Shadowbeak": "Univolt",
    "Paladius": "Univolt",
    "Necromus": "Univolt",
    "Frostallion": "Blazehowl",
    "Frostallion Noct": "Katress",
    "Jetragon": "Katress"
  },
  "Sweepa": {
    "Lamball": "Lovander",
    "Cattiva": "Caprity",
    "Chikipi": "Loupmoon",
    "Lifmunk": "Eikthyrdeer",
    "Foxparks": "Mozzarina",
    "Fuack": "Celaray",
    "Sparkit": "Mozzarina",
    "Tanzee": "Kitsun",
    "Rooby": "Petallia",
    "Pengullet": "Reindrix",
    "Penking": "Wumpo",
    "Jolthog": "Melpaca",
    "Jolthog Cryst": "Melpaca",
    "Gumoss": "Kitsun",
    "Gumoss (Special)": "Kitsun",
    "Vixy": "Caprity",
    "Hoocrates": "Dumud",
    "Teafant": "Loupmoon",
    "Depresso": "Dumud",
    "Cremis": "Caprity",
    "Daedream": "Dinossom",
    "Rushoar": "Foxcicle",
    "Nox": "Arsox",
    "Fuddler": "Dinossom",
    "Killamari": "Digtoise",
    "Mau": "Loupmoon",
    "Mau Cryst": "Eikthyrdeer",
    "Celaray": "Bushi",
    "Direhowl": "Rayhound",
    "Tocotoco": "Reindrix",
    "Flopie": "Digtoise",
    "Mozzarina": "Vanwyrm",
    "Bristla": "Broncherry",
    "Gobfin": "Tombat",
    "Gobfin Ignis": "Tombat",
    "Hangyu": "Eikthyrdeer",
    "Hangyu Cryst": "Eikthyrdeer",
    "Mossanda": "Nitewing",
    "Mossanda Lux": "Sweepa",
    "Woolipop": "Chillet",
    "Caprity": "Univolt",
    "Melpaca": "Vanwyrm",
    "Eikthyrdeer": "Vanwyrm",
    "Eikthyrdeer Terra": "Vanwyrm",
    "Nitewing": "Nitewing",
    "Ribunny": "Broncherry",
    "Incineram": "Azurobe",
    "Incineram Noct": "Azurobe",
    "Cinnamoth": "Sibelyx",
    "Arsox": "Incineram",
    "Dumud": "Vanwyrm",
    "Cawgnito": "Tombat",
    "Leezpunk": "Foxcicle",
    "Leezpunk Ignis": "Petallia",
    "Loupmoon": "Univolt",
    "Galeclaw": "Blazehowl",
    "Robinquill": "Blazehowl",
    "Robinquill Terra": "Blazehowl",
    "Gorirat": "Rayhound",
    "Beegarde": "Rayhound",
    "Elizabee": "Pyrin",
    "Grintale": "Wumpo",
    "Swee": "Digtoise",
    "Sweepa": "Sweepa",
    "Chillet": "Incineram",
    "Univolt": "Elphidran",
    "Foxcicle": "Incineram",
    "Pyrin": "Ragnahawk",
    "Pyrin Noct": "Reptyro",
    "Reindrix": "Bushi",
    "Rayhound": "Anubis",
    "Kitsun": "Bushi",
    "Dazzi": "Dinossom",
    "Lunaris": "Foxcicle",
    "Dinossom": "Incineram",
    "Dinossom Lux": "Incineram",
    "Surfent": "Wumpo Botan",
    "Surfent Terra": "Wumpo Botan",
    "Maraith": "Petallia",
    "Digtoise": "Bushi",
    "Tombat": "Anubis",
    "Lovander": "Univolt",
    "Flambelle": "Mozzarina",
    "Vanwyrm": "Elphidran",
    "Vanwyrm Cryst": "Penking",
    "Bushi": "Penking",
    "Beakon": "Jormuntide",
    "Ragnahawk": "Sweepa",
    "Katress": "Surfent",
    "Wixen": "Arsox",
    "Verdash": "Katress",
    "Vaelet": "Rayhound",
    "Sibelyx": "Mossanda",
    "Elphidran": "Wumpo Botan",
    "Elphidran Aqua": "Kingpaca",
    "Kelpsea": "Kitsun",
    "Kelpsea Ignis": "Digtoise",
    "Azurobe": "Sibelyx",
    "Cryolinx": "Relaxaurus",
    "Blazehowl": "Surfent",
    "Blazehowl Noct": "Elphidran",
    "Relaxaurus": "Warsect",
    "Relaxaurus Lux": "Warsect",
    "Broncherry": "Bushi",
    "Broncherry Aqua": "Bushi",
    "Petallia": "Incineram",
    "Reptyro": "Pyrin",
    "Ice Reptyro": "Reptyro",
    "Kingpaca": "Sibelyx",
    "Ice Kingpaca": "Nitewing",
    "Mammorest": "Pyrin",
    "Mammorest Cryst": "Quivern",
    "Wumpo": "Mossanda",
    "Wumpo Botan": "Sibelyx",
    "Warsect": "Ragnahawk",
    "Fenglope": "Katress",
    "Felbat": "Blazehowl",
    "Quivern": "Ragnahawk",
    "Blazamut": "Beakon",
    "Helzephyr": "Mammorest",
    "Astegon": "Relaxaurus",
    "Menasting": "Elizabee",
    "Anubis": "Cinnamoth",
    "Jormuntide": "Pyrin",
    "Jormuntide Ignis": "Pyrin",
    "Suzaku": "Beakon",
    "Suzaku Aqua": "Beakon",
    "Grizzbolt": "Jormuntide",
    "Lyleen": "Elizabee",
    "Lyleen Noct": "Jormuntide",
    "Faleris": "Ragnahawk",
    "Orserk": "Relaxaurus",
    "Shadowbeak": "Beakon",
    "Paladius": "Menasting",
    "Necromus": "Beakon",
    "Frostallion": "Menasting",
    "Frostallion Noct": "Menasting",
    "Jetragon": "Menasting"
  },
  "Chillet": {
    "Lamball": "Rushoar",
    "Cattiva": "Rushoar",
    "Chikipi": "Maraith",
    "Lifmunk": "Lunaris",
    "Foxparks": "Lunaris",
    "Fuack": "Direhowl",
    "Sparkit": "Lunaris",
    "Tanzee": "Galeclaw",
    "Rooby": "Fenglope",
    "Pengullet": "Cawgnito",
    "Penking": "Vanwyrm",
    "Jolthog": "Gobfin",
    "Jolthog Cryst": "Cawgnito",
    "Gumoss": "Robinquill",
    "Gumoss (Special)": "Robinquill",
    "Vixy": "Rushoar",
    "Hoocrates": "Gobfin",
    "Teafant": "Maraith",
    "Depresso": "Gobfin",
    "Cremis": "Rushoar",
    "Daedream": "Robinquill",
    "Rushoar": "Loupmoon",
    "Nox": "Verdash",
    "Fuddler": "Felbat",
    "Killamari": "Gorirat",
    "Mau": "Rushoar",
    "Mau Cryst": "Leezpunk",
    "Celaray": "Kitsun",
    "Direhowl": "Caprity",
    "Tocotoco": "Beegarde",
    "Flopie": "Gorirat",
    "Mozzarina": "Digtoise",
    "Bristla": "Direhowl",
    "Gobfin": "Loupmoon",
    "Gobfin Ignis": "Loupmoon",
    "Hangyu": "Lunaris",
    "Hangyu Cryst": "Lunaris",
    "Mossanda": "Incineram",
    "Mossanda Lux": "Incineram",
    "Woolipop": "Verdash",
    "Caprity": "Broncherry",
    "Melpaca": "Digtoise",
    "Eikthyrdeer": "Broncherry",
    "Eikthyrdeer Terra": "Digtoise",
    "Nitewing": "Incineram",
    "Ribunny": "Direhowl",
    "Incineram": "Katress",
    "Incineram Noct": "Univolt",
    "Cinnamoth": "Bushi",
    "Arsox": "Arsox",
    "Dumud": "Digtoise",
    "Cawgnito": "Lovander",
    "Leezpunk": "Loupmoon",
    "Leezpunk Ignis": "Fenglope",
    "Loupmoon": "Reindrix",
    "Galeclaw": "Eikthyrdeer",
    "Robinquill": "Mozzarina",
    "Robinquill Terra": "Dumud",
    "Gorirat": "Eikthyrdeer",
    "Beegarde": "Caprity",
    "Elizabee": "Anubis",
    "Grintale": "Vanwyrm",
    "Swee": "Vaelet",
    "Sweepa": "Incineram",
    "Chillet": "Chillet",
    "Univolt": "Rayhound",
    "Foxcicle": "Petallia",
    "Pyrin": "Anubis",
    "Pyrin Noct": "Penking",
    "Reindrix": "Digtoise",
    "Rayhound": "Foxcicle",
    "Kitsun": "Dinossom",
    "Dazzi": "Felbat",
    "Lunaris": "Loupmoon",
    "Dinossom": "Dinossom",
    "Dinossom Lux": "Chillet",
    "Surfent": "Univolt",
    "Surfent Terra": "Univolt",
    "Maraith": "Fenglope",
    "Digtoise": "Kitsun",
    "Tombat": "Petallia",
    "Lovander": "Celaray",
    "Flambelle": "Lunaris",
    "Vanwyrm": "Rayhound",
    "Vanwyrm Cryst": "Blazehowl",
    "Bushi": "Blazehowl",
    "Beakon": "Grintale",
    "Ragnahawk": "Incineram",
    "Katress": "Tombat",
    "Wixen": "Fenglope",
    "Verdash": "Dumud",
    "Vaelet": "Eikthyrdeer",
    "Sibelyx": "Bushi",
    "Elphidran": "Univolt",
    "Elphidran Aqua": "Vanwyrm",
    "Kelpsea": "Galeclaw",
    "Kelpsea Ignis": "Galeclaw",
    "Azurobe": "Vanwyrm",
    "Cryolinx": "Wumpo",
    "Blazehowl": "Tombat",
    "Blazehowl Noct": "Rayhound",
    "Relaxaurus": "Elphidran",
    "Relaxaurus Lux": "Elphidran",
    "Broncherry": "Kitsun",
    "Broncherry Aqua": "Dinossom",
    "Petallia": "Arsox",
    "Reptyro": "Surfent",
    "Ice Reptyro": "Penking",
    "Kingpaca": "Bushi",
    "Ice Kingpaca": "Bushi",
    "Mammorest": "Elphidran",
    "Mammorest Cryst": "Elphidran",
    "Wumpo": "Bushi",
    "Wumpo Botan": "Bushi",
    "Warsect": "Anubis",
    "Fenglope": "Melpaca",
    "Felbat": "Mozzarina",
    "Quivern": "Anubis",
    "Blazamut": "Sweepa",
    "Helzephyr": "Azurobe",
    "Astegon": "Wumpo Botan",
    "Menasting": "Elphidran",
    "Anubis": "Univolt",
    "Jormuntide": "Surfent",
    "Jormuntide Ignis": "Surfent",
    "Suzaku": "Nitewing",
    "Suzaku Aqua": "Nitewing",
    "Grizzbolt": "Azurobe",
    "Lyleen": "Penking",
    "Lyleen Noct": "Azurobe",
    "Faleris": "Incineram",
    "Orserk": "Kingpaca",
    "Shadowbeak": "Mossanda",
    "Paladius": "Sibelyx",
    "Necromus": "Mossanda",
    "Frostallion": "Wumpo",
    "Frostallion Noct": "Sibelyx",
    "Jetragon": "Sibelyx"
  },
  "Univolt": {
    "Lamball": "Cawgnito",
    "Cattiva": "Beegarde",
    "Chikipi": "Gobfin",
    "Lifmunk": "Direhowl",
    "Foxparks": "Gorirat",
    "Fuack": "Felbat",
    "Sparkit": "Gorirat",
    "Tanzee": "Loupmoon",
    "Rooby": "Eikthyrdeer",
    "Pengullet": "Robinquill",
    "Penking": "Incineram",
    "Jolthog": "Galeclaw",
    "Jolthog Cryst": "Robinquill",
    "Gumoss": "Loupmoon",
    "Gumoss (Special)": "Loupmoon",
    "Vixy": "Direhowl",
    "Hoocrates": "Galeclaw",
    "Teafant": "Gobfin",
    "Depresso": "Galeclaw",
    "Cremis": "Beegarde",
    "Daedream": "Loupmoon",
    "Rushoar": "Mozzarina",
    "Nox": "Caprity",
    "Fuddler": "Loupmoon",
    "Killamari": "Fenglope",
    "Mau": "Cawgnito",
    "Mau Cryst": "Direhowl",
    "Celaray": "Petallia",
    "Direhowl": "Celaray",
    "Tocotoco": "Felbat",
    "Flopie": "Fenglope",
    "Mozzarina": "Arsox",
    "Bristla": "Felbat",
    "Gobfin": "Melpaca",
    "Gobfin Ignis": "Melpaca",
    "Hangyu": "Vaelet",
    "Hangyu Cryst": "Vaelet",
    "Mossanda": "Surfent",
    "Mossanda Lux": "Elphidran",
    "Woolipop": "Caprity",
    "Caprity": "Chillet",
    "Melpaca": "Arsox",
    "Eikthyrdeer": "Chillet",
    "Eikthyrdeer Terra": "Arsox",
    "Nitewing": "Elphidran",
    "Ribunny": "Verdash",
    "Incineram": "Bushi",
    "Incineram Noct": "Bushi",
    "Cinnamoth": "Incineram",
    "Arsox": "Rayhound",
    "Dumud": "Arsox",
    "Cawgnito": "Reindrix",
    "Leezpunk": "Dumud",
    "Leezpunk Ignis": "Mozzarina",
    "Loupmoon": "Dinossom",
    "Galeclaw": "Digtoise",
    "Robinquill": "Digtoise",
    "Robinquill Terra": "Digtoise",
    "Gorirat": "Broncherry",
    "Beegarde": "Reindrix",
    "Elizabee": "Azurobe",
    "Grintale": "Incineram",
    "Swee": "Verdash",
    "Sweepa": "Elphidran",
    "Chillet": "Rayhound",
    "Univolt": "Univolt",
    "Foxcicle": "Blazehowl",
    "Pyrin": "Penking",
    "Pyrin Noct": "Wumpo",
    "Reindrix": "Petallia",
    "Rayhound": "Blazehowl",
    "Kitsun": "Tombat",
    "Dazzi": "Loupmoon",
    "Lunaris": "Dumud",
    "Dinossom": "Tombat",
    "Dinossom Lux": "Tombat",
    "Surfent": "Bushi",
    "Surfent Terra": "Incineram",
    "Maraith": "Eikthyrdeer",
    "Digtoise": "Foxcicle",
    "Tombat": "Blazehowl",
    "Lovander": "Dinossom",
    "Flambelle": "Gorirat",
    "Vanwyrm": "Univolt",
    "Vanwyrm Cryst": "Vanwyrm",
    "Bushi": "Vanwyrm",
    "Beakon": "Sibelyx",
    "Ragnahawk": "Elphidran",
    "Katress": "Univolt",
    "Wixen": "Eikthyrdeer",
    "Verdash": "Kitsun",
    "Vaelet": "Broncherry",
    "Sibelyx": "Anubis",
    "Elphidran": "Incineram",
    "Elphidran Aqua": "Incineram",
    "Kelpsea": "Fenglope",
    "Kelpsea Ignis": "Fenglope",
    "Azurobe": "Incineram",
    "Cryolinx": "Sweepa",
    "Blazehowl": "Katress",
    "Blazehowl Noct": "Univolt",
    "Relaxaurus": "Wumpo Botan",
    "Relaxaurus Lux": "Wumpo Botan",
    "Broncherry": "Foxcicle",
    "Broncherry Aqua": "Foxcicle",
    "Petallia": "Rayhound",
    "Reptyro": "Azurobe",
    "Ice Reptyro": "Sibelyx",
    "Kingpaca": "Anubis",
    "Ice Kingpaca": "Surfent",
    "Mammorest": "Cinnamoth",
    "Mammorest Cryst": "Wumpo Botan",
    "Wumpo": "Anubis",
    "Wumpo Botan": "Anubis",
    "Warsect": "Grintale",
    "Fenglope": "Kitsun",
    "Felbat": "Digtoise",
    "Quivern": "Penking",
    "Blazamut": "Warsect",
    "Helzephyr": "Mossanda",
    "Astegon": "Nitewing",
    "Menasting": "Kingpaca",
    "Anubis": "Bushi",
    "Jormuntide": "Azurobe",
    "Jormuntide Ignis": "Azurobe",
    "Suzaku": "Pyrin",
    "Suzaku Aqua": "Pyrin",
    "Grizzbolt": "Sibelyx",
    "Lyleen": "Wumpo",
    "Lyleen Noct": "Sibelyx",
    "Faleris": "Penking",
    "Orserk": "Sweepa",
    "Shadowbeak": "Pyrin",
    "Paladius": "Ragnahawk",
    "Necromus": "Ragnahawk",
    "Frostallion": "Sweepa",
    "Frostallion Noct": "Ragnahawk",
    "Jetragon": "Ragnahawk"
  },
  "Foxcicle": {
    "Lamball": "Lunaris",
    "Cattiva": "Lunaris",
    "Chikipi": "Rushoar",
    "Lifmunk": "Gobfin",
    "Foxparks": "Cawgnito",
    "Fuack": "Gorirat",
    "Sparkit": "Gobfin",
    "Tanzee": "Felbat",
    "Rooby": "Loupmoon",
    "Pengullet": "Direhowl",
    "Penking": "Bushi",
    "Jolthog": "Direhowl",
    "Jolthog Cryst": "Direhowl",
    "Gumoss": "Felbat",
    "Gumoss (Special)": "Felbat",
    "Vixy": "Lunaris",
    "Hoocrates": "Cawgnito",
    "Teafant": "Rushoar",
    "Depresso": "Beegarde",
    "Cremis": "Lunaris",
    "Daedream": "Verdash",
    "Rushoar": "Loupmoon",
    "Nox": "Fenglope",
    "Fuddler": "Verdash",
    "Killamari": "Galeclaw",
    "Mau": "Leezpunk",
    "Mau Cryst": "Lunaris",
    "Celaray": "Dinossom",
    "Direhowl": "Mozzarina",
    "Tocotoco": "Vaelet",
    "Flopie": "Robinquill",
    "Mozzarina": "Kitsun",
    "Bristla": "Gorirat",
    "Gobfin": "Eikthyrdeer",
    "Gobfin Ignis": "Caprity",
    "Hangyu": "Gobfin",
    "Hangyu Cryst": "Gobfin",
    "Mossanda": "Incineram",
    "Mossanda Lux": "Anubis",
    "Woolipop": "Fenglope",
    "Caprity": "Digtoise",
    "Melpaca": "Kitsun",
    "Eikthyrdeer": "Digtoise",
    "Eikthyrdeer Terra": "Kitsun",
    "Nitewing": "Incineram",
    "Ribunny": "Galeclaw",
    "Incineram": "Univolt",
    "Incineram Noct": "Univolt",
    "Cinnamoth": "Bushi",
    "Arsox": "Petallia",
    "Dumud": "Kitsun",
    "Cawgnito": "Eikthyrdeer",
    "Leezpunk": "Lovander",
    "Leezpunk Ignis": "Loupmoon",
    "Loupmoon": "Digtoise",
    "Galeclaw": "Dumud",
    "Robinquill": "Melpaca",
    "Robinquill Terra": "Reindrix",
    "Gorirat": "Dumud",
    "Beegarde": "Eikthyrdeer",
    "Elizabee": "Elphidran",
    "Grintale": "Bushi",
    "Swee": "Galeclaw",
    "Sweepa": "Incineram",
    "Chillet": "Petallia",
    "Univolt": "Blazehowl",
    "Foxcicle": "Foxcicle",
    "Pyrin": "Surfent",
    "Pyrin Noct": "Azurobe",
    "Reindrix": "Dinossom",
    "Rayhound": "Tombat",
    "Kitsun": "Arsox",
    "Dazzi": "Fenglope",
    "Lunaris": "Caprity",
    "Dinossom": "Arsox",
    "Dinossom Lux": "Arsox",
    "Surfent": "Vanwyrm",
    "Surfent Terra": "Vanwyrm",
    "Maraith": "Loupmoon",
    "Digtoise": "Chillet",
    "Tombat": "Tombat",
    "Lovander": "Digtoise",
    "Flambelle": "Cawgnito",
    "Vanwyrm": "Vanwyrm Cryst",
    "Vanwyrm Cryst": "Univolt",
    "Bushi": "Katress",
    "Beakon": "Cinnamoth",
    "Ragnahawk": "Anubis",
    "Katress": "Rayhound",
    "Wixen": "Loupmoon",
    "Verdash": "Reindrix",
    "Vaelet": "Mozzarina",
    "Sibelyx": "Incineram",
    "Elphidran": "Vanwyrm",
    "Elphidran Aqua": "Bushi",
    "Kelpsea": "Felbat",
    "Kelpsea Ignis": "Robinquill",
    "Azurobe": "Bushi",
    "Cryolinx": "Sibelyx",
    "Blazehowl": "Rayhound",
    "Blazehowl Noct": "Blazehowl",
    "Relaxaurus": "Penking",
    "Relaxaurus Lux": "Penking",
    "Broncherry": "Dinossom",
    "Broncherry Aqua": "Chillet",
    "Petallia": "Foxcicle",
    "Reptyro": "Ice Reptyro",
    "Ice Reptyro": "Azurobe",
    "Kingpaca": "Incineram",
    "Ice Kingpaca": "Incineram",
    "Mammorest": "Elphidran",
    "Mammorest Cryst": "Penking",
    "Wumpo": "Incineram",
    "Wumpo Botan": "Bushi",
    "Warsect": "Elphidran",
    "Fenglope": "Celaray",
    "Felbat": "Melpaca",
    "Quivern": "Surfent",
    "Blazamut": "Ragnahawk",
    "Helzephyr": "Wumpo Botan",
    "Astegon": "Sibelyx",
    "Menasting": "Grintale",
    "Anubis": "Vanwyrm",
    "Jormuntide": "Elphidran",
    "Jormuntide Ignis": "Elphidran",
    "Suzaku": "Sweepa",
    "Suzaku Aqua": "Sweepa",
    "Grizzbolt": "Wumpo Botan",
    "Lyleen": "Azurobe",
    "Lyleen Noct": "Wumpo Botan",
    "Faleris": "Anubis",
    "Orserk": "Sibelyx",
    "Shadowbeak": "Sweepa",
    "Paladius": "Nitewing",
    "Necromus": "Nitewing",
    "Frostallion": "Sibelyx",
    "Frostallion Noct": "Mossanda",
    "Jetragon": "Nitewing"
  },
  "Pyrin": {
    "Lamball": "Eikthyrdeer",
    "Cattiva": "Mozzarina",
    "Chikipi": "Caprity",
    "Lifmunk": "Dumud",
    "Foxparks": "Reindrix",
    "Fuack": "Digtoise",
    "Sparkit": "Melpaca",
    "Tanzee": "Chillet",
    "Rooby": "Foxcicle",
    "Pengullet": "Digtoise",
    "Penking": "Sibelyx",
    "Jolthog": "Broncherry",
    "Jolthog Cryst": "Broncherry",
    "Gumoss": "Chillet",
    "Gumoss (Special)": "Chillet",
    "Vixy": "Mozzarina",
    "Hoocrates": "Reindrix",
    "Teafant": "Eikthyrdeer",
    "Depresso": "Celaray",
    "Cremis": "Mozzarina",
    "Daedream": "Arsox",
    "Rushoar": "Tombat",
    "Nox": "Foxcicle",
    "Fuddler": "Arsox",
    "Killamari": "Kitsun",
    "Mau": "Eikthyrdeer",
    "Mau Cryst": "Dumud",
    "Celaray": "Incineram",
    "Direhowl": "Blazehowl",
    "Tocotoco": "Digtoise",
    "Flopie": "Dinossom",
    "Mozzarina": "Bushi",
    "Bristla": "Digtoise",
    "Gobfin": "Rayhound",
    "Gobfin Ignis": "Rayhound",
    "Hangyu": "Melpaca",
    "Hangyu Cryst": "Melpaca",
    "Mossanda": "Sweepa",
    "Mossanda Lux": "Ragnahawk",
    "Woolipop": "Petallia",
    "Caprity": "Bushi",
    "Melpaca": "Bushi",
    "Eikthyrdeer": "Bushi",
    "Eikthyrdeer Terra": "Bushi",
    "Nitewing": "Ragnahawk",
    "Ribunny": "Kitsun",
    "Incineram": "Wumpo Botan",
    "Incineram Noct": "Kingpaca",
    "Cinnamoth": "Nitewing",
    "Arsox": "Anubis",
    "Dumud": "Bushi",
    "Cawgnito": "Blazehowl",
    "Leezpunk": "Rayhound",
    "Leezpunk Ignis": "Tombat",
    "Loupmoon": "Vanwyrm",
    "Galeclaw": "Katress",
    "Robinquill": "Univolt",
    "Robinquill Terra": "Univolt",
    "Gorirat": "Katress",
    "Beegarde": "Blazehowl",
    "Elizabee": "Warsect",
    "Grintale": "Mossanda",
    "Swee": "Kitsun",
    "Sweepa": "Ragnahawk",
    "Chillet": "Anubis",
    "Univolt": "Penking",
    "Foxcicle": "Surfent",
    "Pyrin": "Pyrin",
    "Pyrin Noct": "Mammorest",
    "Reindrix": "Bushi",
    "Rayhound": "Elphidran",
    "Kitsun": "Incineram",
    "Dazzi": "Arsox",
    "Lunaris": "Rayhound",
    "Dinossom": "Incineram",
    "Dinossom Lux": "Incineram",
    "Surfent": "Wumpo",
    "Surfent Terra": "Sibelyx",
    "Maraith": "Tombat",
    "Digtoise": "Incineram",
    "Tombat": "Surfent",
    "Lovander": "Vanwyrm",
    "Flambelle": "Reindrix",
    "Vanwyrm": "Grintale",
    "Vanwyrm Cryst": "Cinnamoth",
    "Bushi": "Azurobe",
    "Beakon": "Relaxaurus",
    "Ragnahawk": "Pyrin",
    "Katress": "Pyrin Noct",
    "Wixen": "Foxcicle",
    "Verdash": "Univolt",
    "Vaelet": "Blazehowl",
    "Sibelyx": "Sweepa",
    "Elphidran": "Sibelyx",
    "Elphidran Aqua": "Sibelyx",
    "Kelpsea": "Dinossom",
    "Kelpsea Ignis": "Dinossom",
    "Azurobe": "Mossanda",
    "Cryolinx": "Menasting",
    "Blazehowl": "Elphidran",
    "Blazehowl Noct": "Penking",
    "Relaxaurus": "Reptyro",
    "Relaxaurus Lux": "Jormuntide",
    "Broncherry": "Incineram",
    "Broncherry Aqua": "Incineram",
    "Petallia": "Anubis",
    "Reptyro": "Warsect",
    "Ice Reptyro": "Mammorest",
    "Kingpaca": "Nitewing",
    "Ice Kingpaca": "Sweepa",
    "Mammorest": "Elizabee",
    "Mammorest Cryst": "Reptyro",
    "Wumpo": "Sweepa",
    "Wumpo Botan": "Nitewing",
    "Warsect": "Quivern",
    "Fenglope": "Univolt",
    "Felbat": "Univolt",
    "Quivern": "Pyrin",
    "Blazamut": "Helzephyr",
    "Helzephyr": "Relaxaurus",
    "Astegon": "Menasting",
    "Menasting": "Jormuntide",
    "Anubis": "Wumpo",
    "Jormuntide": "Elizabee",
    "Jormuntide Ignis": "Warsect",
    "Suzaku": "Beakon",
    "Suzaku Aqua": "Helzephyr",
    "Grizzbolt": "Relaxaurus",
    "Lyleen": "Jormuntide",
    "Lyleen Noct": "Relaxaurus",
    "Faleris": "Pyrin",
    "Orserk": "Menasting",
    "Shadowbeak": "Beakon",
    "Paladius": "Beakon",
    "Necromus": "Beakon",
    "Frostallion": "Beakon",
    "Frostallion Noct": "Beakon",
    "Jetragon": "Beakon"
  },
  "Pyrin Noct": {
    "variant": true,
    "Lamball": "Digtoise",
    "Cattiva": "Digtoise",
    "Chikipi": "Celaray",
    "Lifmunk": "Kitsun",
    "Foxparks": "Dinossom",
    "Fuack": "Arsox",
    "Sparkit": "Kitsun",
    "Tanzee": "Tombat",
    "Rooby": "Katress",
    "Pengullet": "Arsox",
    "Penking": "Ragnahawk",
    "Jolthog": "Chillet",
    "Jolthog Cryst": "Chillet",
    "Gumoss": "Rayhound",
    "Gumoss (Special)": "Rayhound",
    "Vixy": "Digtoise",
    "Hoocrates": "Dinossom",
    "Teafant": "Broncherry",
    "Depresso": "Dinossom",
    "Cremis": "Digtoise",
    "Daedream": "Rayhound",
    "Rushoar": "Univolt",
    "Nox": "Blazehowl",
    "Fuddler": "Rayhound",
    "Killamari": "Foxcicle",
    "Mau": "Broncherry",
    "Mau Cryst": "Digtoise",
    "Celaray": "Surfent",
    "Direhowl": "Vanwyrm",
    "Tocotoco": "Arsox",
    "Flopie": "Foxcicle",
    "Mozzarina": "Anubis",
    "Bristla": "Petallia",
    "Gobfin": "Vanwyrm",
    "Gobfin Ignis": "Univolt",
    "Hangyu": "Kitsun",
    "Hangyu Cryst": "Kitsun",
    "Mossanda": "Elizabee",
    "Mossanda Lux": "Jormuntide",
    "Woolipop": "Blazehowl",
    "Caprity": "Incineram",
    "Melpaca": "Anubis",
    "Eikthyrdeer": "Anubis",
    "Eikthyrdeer Terra": "Anubis",
    "Nitewing": "Elizabee",
    "Ribunny": "Petallia",
    "Incineram": "Nitewing",
    "Incineram Noct": "Sweepa",
    "Cinnamoth": "Pyrin",
    "Arsox": "Penking",
    "Dumud": "Anubis",
    "Cawgnito": "Vanwyrm",
    "Leezpunk": "Univolt",
    "Leezpunk Ignis": "Univolt",
    "Loupmoon": "Incineram",
    "Galeclaw": "Bushi",
    "Robinquill": "Bushi",
    "Robinquill Terra": "Bushi",
    "Gorirat": "Bushi",
    "Beegarde": "Vanwyrm",
    "Elizabee": "Relaxaurus",
    "Grintale": "Ragnahawk",
    "Swee": "Foxcicle",
    "Sweepa": "Reptyro",
    "Chillet": "Penking",
    "Univolt": "Wumpo",
    "Foxcicle": "Azurobe",
    "Pyrin": "Mammorest",
    "Pyrin Noct": "Pyrin Noct",
    "Reindrix": "Surfent",
    "Rayhound": "Cinnamoth",
    "Kitsun": "Elphidran",
    "Dazzi": "Rayhound",
    "Lunaris": "Univolt",
    "Dinossom": "Elphidran",
    "Dinossom Lux": "Penking",
    "Surfent": "Sweepa",
    "Surfent Terra": "Sweepa",
    "Maraith": "Katress",
    "Digtoise": "Elphidran",
    "Tombat": "Azurobe",
    "Lovander": "Incineram",
    "Flambelle": "Dinossom",
    "Vanwyrm": "Sibelyx",
    "Vanwyrm Cryst": "Mossanda",
    "Bushi": "Sibelyx",
    "Beakon": "Beakon",
    "Ragnahawk": "Jormuntide",
    "Katress": "Kingpaca",
    "Wixen": "Katress",
    "Verdash": "Incineram",
    "Vaelet": "Bushi",
    "Sibelyx": "Warsect",
    "Elphidran": "Ragnahawk",
    "Elphidran Aqua": "Ragnahawk",
    "Kelpsea": "Tombat",
    "Kelpsea Ignis": "Tombat",
    "Azurobe": "Pyrin",
    "Cryolinx": "Helzephyr",
    "Blazehowl": "Wumpo Botan",
    "Blazehowl Noct": "Sibelyx",
    "Relaxaurus": "Menasting",
    "Relaxaurus Lux": "Menasting",
    "Broncherry": "Elphidran",
    "Broncherry Aqua": "Elphidran",
    "Petallia": "Grintale",
    "Reptyro": "Relaxaurus",
    "Ice Reptyro": "Beakon",
    "Kingpaca": "Pyrin",
    "Ice Kingpaca": "Warsect",
    "Mammorest": "Relaxaurus",
    "Mammorest Cryst": "Menasting",
    "Wumpo": "Quivern",
    "Wumpo Botan": "Pyrin",
    "Warsect": "Relaxaurus",
    "Fenglope": "Incineram",
    "Felbat": "Bushi",
    "Quivern": "Mammorest",
    "Blazamut": "Cryolinx",
    "Helzephyr": "Beakon",
    "Astegon": "Helzephyr",
    "Menasting": "Menasting",
    "Anubis": "Sweepa",
    "Jormuntide": "Relaxaurus",
    "Jormuntide Ignis": "Relaxaurus",
    "Suzaku": "Astegon",
    "Suzaku Aqua": "Cryolinx",
    "Grizzbolt": "Beakon",
    "Lyleen": "Menasting",
    "Lyleen Noct": "Beakon",
    "Faleris": "Jormuntide",
    "Orserk": "Helzephyr",
    "Shadowbeak": "Astegon",
    "Paladius": "Astegon",
    "Necromus": "Astegon",
    "Frostallion": "Helzephyr",
    "Frostallion Noct": "Astegon",
    "Jetragon": "Astegon"
  },
  "Reindrix": {
    "Lamball": "Nox",
    "Cattiva": "Wixen",
    "Chikipi": "Woolipop",
    "Lifmunk": "Rooby",
    "Foxparks": "Rushoar",
    "Fuack": "Lunaris",
    "Sparkit": "Maraith",
    "Tanzee": "Direhowl",
    "Rooby": "Robinquill",
    "Pengullet": "Lunaris",
    "Penking": "Katress",
    "Jolthog": "Rushoar",
    "Jolthog Cryst": "Leezpunk",
    "Gumoss": "Direhowl",
    "Gumoss (Special)": "Direhowl",
    "Vixy": "Wixen",
    "Hoocrates": "Rushoar",
    "Teafant": "Woolipop",
    "Depresso": "Rushoar",
    "Cremis": "Wixen",
    "Daedream": "Direhowl",
    "Rushoar": "Felbat",
    "Nox": "Galeclaw",
    "Fuddler": "Vaelet",
    "Killamari": "Gobfin",
    "Mau": "Nox",
    "Mau Cryst": "Wixen",
    "Celaray": "Reindrix",
    "Direhowl": "Fenglope",
    "Tocotoco": "Lunaris",
    "Flopie": "Cawgnito",
    "Mozzarina": "Dumud",
    "Bristla": "Lunaris",
    "Gobfin": "Fenglope",
    "Gobfin Ignis": "Verdash",
    "Hangyu": "Maraith",
    "Hangyu Cryst": "Maraith",
    "Mossanda": "Vanwyrm",
    "Mossanda Lux": "Bushi",
    "Woolipop": "Galeclaw",
    "Caprity": "Mozzarina",
    "Melpaca": "Melpaca",
    "Eikthyrdeer": "Dumud",
    "Eikthyrdeer Terra": "Melpaca",
    "Nitewing": "Vanwyrm",
    "Ribunny": "Gobfin",
    "Incineram": "Rayhound",
    "Incineram Noct": "Rayhound",
    "Cinnamoth": "Univolt",
    "Arsox": "Kitsun",
    "Dumud": "Melpaca",
    "Cawgnito": "Fenglope",
    "Leezpunk": "Felbat",
    "Leezpunk Ignis": "Felbat",
    "Loupmoon": "Eikthyrdeer",
    "Galeclaw": "Loupmoon",
    "Robinquill": "Loupmoon",
    "Robinquill Terra": "Lovander",
    "Gorirat": "Loupmoon",
    "Beegarde": "Fenglope",
    "Elizabee": "Incineram",
    "Grintale": "Katress",
    "Swee": "Gobfin",
    "Sweepa": "Bushi",
    "Chillet": "Digtoise",
    "Univolt": "Petallia",
    "Foxcicle": "Dinossom",
    "Pyrin": "Bushi",
    "Pyrin Noct": "Surfent",
    "Reindrix": "Reindrix",
    "Rayhound": "Dinossom",
    "Kitsun": "Digtoise",
    "Dazzi": "Gorirat",
    "Lunaris": "Verdash",
    "Dinossom": "Digtoise",
    "Dinossom Lux": "Digtoise",
    "Surfent": "Blazehowl",
    "Surfent Terra": "Blazehowl",
    "Maraith": "Robinquill",
    "Digtoise": "Broncherry",
    "Tombat": "Dinossom",
    "Lovander": "Mozzarina",
    "Flambelle": "Maraith",
    "Vanwyrm": "Foxcicle",
    "Vanwyrm Cryst": "Tombat",
    "Bushi": "Foxcicle",
    "Beakon": "Elphidran",
    "Ragnahawk": "Bushi",
    "Katress": "Arsox",
    "Wixen": "Robinquill",
    "Verdash": "Caprity",
    "Vaelet": "Loupmoon",
    "Sibelyx": "Vanwyrm",
    "Elphidran": "Blazehowl",
    "Elphidran Aqua": "Blazehowl",
    "Kelpsea": "Beegarde",
    "Kelpsea Ignis": "Cawgnito",
    "Azurobe": "Univolt",
    "Cryolinx": "Azurobe",
    "Blazehowl": "Arsox",
    "Blazehowl Noct": "Petallia",
    "Relaxaurus": "Anubis",
    "Relaxaurus Lux": "Anubis",
    "Broncherry": "Celaray",
    "Broncherry Aqua": "Broncherry",
    "Petallia": "Kitsun",
    "Reptyro": "Incineram",
    "Ice Reptyro": "Surfent",
    "Kingpaca": "Ice Kingpaca",
    "Ice Kingpaca": "Vanwyrm",
    "Mammorest": "Incineram",
    "Mammorest Cryst": "Incineram",
    "Wumpo": "Univolt",
    "Wumpo Botan": "Univolt",
    "Warsect": "Incineram",
    "Fenglope": "Caprity",
    "Felbat": "Loupmoon",
    "Quivern": "Incineram",
    "Blazamut": "Sibelyx",
    "Helzephyr": "Elphidran",
    "Astegon": "Penking",
    "Menasting": "Anubis",
    "Anubis": "Rayhound",
    "Jormuntide": "Incineram",
    "Jormuntide Ignis": "Incineram",
    "Suzaku": "Wumpo",
    "Suzaku Aqua": "Sibelyx",
    "Grizzbolt": "Elphidran",
    "Lyleen": "Anubis",
    "Lyleen Noct": "Elphidran",
    "Faleris": "Bushi",
    "Orserk": "Grintale",
    "Shadowbeak": "Kingpaca",
    "Paladius": "Wumpo Botan",
    "Necromus": "Wumpo Botan",
    "Frostallion": "Azurobe",
    "Frostallion Noct": "Cinnamoth",
    "Jetragon": "Wumpo Botan"
  },
  "Rayhound": {
    "Lamball": "Lunaris",
    "Cattiva": "Lunaris",
    "Chikipi": "Leezpunk",
    "Lifmunk": "Gobfin",
    "Foxparks": "Beegarde",
    "Fuack": "Galeclaw",
    "Sparkit": "Cawgnito",
    "Tanzee": "Verdash",
    "Rooby": "Loupmoon",
    "Pengullet": "Gorirat",
    "Penking": "Bushi",
    "Jolthog": "Direhowl",
    "Jolthog Cryst": "Vaelet",
    "Gumoss": "Verdash",
    "Gumoss (Special)": "Verdash",
    "Vixy": "Gobfin",
    "Hoocrates": "Direhowl",
    "Teafant": "Lunaris",
    "Depresso": "Direhowl",
    "Cremis": "Gobfin",
    "Daedream": "Fenglope",
    "Rushoar": "Caprity",
    "Nox": "Loupmoon",
    "Fuddler": "Fenglope",
    "Killamari": "Robinquill",
    "Mau": "Lunaris",
    "Mau Cryst": "Gobfin",
    "Celaray": "Chillet",
    "Direhowl": "Dumud",
    "Tocotoco": "Gorirat",
    "Flopie": "Felbat",
    "Mozzarina": "Kitsun",
    "Bristla": "Galeclaw",
    "Gobfin": "Eikthyrdeer",
    "Gobfin Ignis": "Eikthyrdeer",
    "Hangyu": "Cawgnito",
    "Hangyu Cryst": "Cawgnito",
    "Mossanda": "Grizzbolt",
    "Mossanda Lux": "Anubis",
    "Woolipop": "Loupmoon",
    "Caprity": "Kitsun",
    "Melpaca": "Dinossom",
    "Eikthyrdeer": "Kitsun",
    "Eikthyrdeer Terra": "Dinossom",
    "Nitewing": "Anubis",
    "Ribunny": "Galeclaw",
    "Incineram": "Vanwyrm",
    "Incineram Noct": "Vanwyrm",
    "Cinnamoth": "Incineram",
    "Arsox": "Foxcicle",
    "Dumud": "Dinossom",
    "Cawgnito": "Mozzarina",
    "Leezpunk": "Caprity",
    "Leezpunk Ignis": "Lovander",
    "Loupmoon": "Digtoise",
    "Galeclaw": "Melpaca",
    "Robinquill": "Reindrix",
    "Robinquill Terra": "Celaray",
    "Gorirat": "Melpaca",
    "Beegarde": "Mozzarina",
    "Elizabee": "Elphidran",
    "Grintale": "Bushi",
    "Swee": "Robinquill",
    "Sweepa": "Anubis",
    "Chillet": "Foxcicle",
    "Univolt": "Blazehowl",
    "Foxcicle": "Tombat",
    "Pyrin": "Elphidran",
    "Pyrin Noct": "Cinnamoth",
    "Reindrix": "Dinossom",
    "Rayhound": "Rayhound",
    "Kitsun": "Arsox",
    "Dazzi": "Fenglope",
    "Lunaris": "Eikthyrdeer",
    "Dinossom": "Dinossom Lux",
    "Dinossom Lux": "Petallia",
    "Surfent": "Vanwyrm",
    "Surfent Terra": "Bushi",
    "Maraith": "Loupmoon",
    "Digtoise": "Arsox",
    "Tombat": "Tombat",
    "Lovander": "Digtoise",
    "Flambelle": "Beegarde",
    "Vanwyrm": "Katress",
    "Vanwyrm Cryst": "Univolt",
    "Bushi": "Univolt",
    "Beakon": "Wumpo Botan",
    "Ragnahawk": "Surfent",
    "Katress": "Blazehowl",
    "Wixen": "Loupmoon",
    "Verdash": "Broncherry",
    "Vaelet": "Dumud",
    "Sibelyx": "Incineram",
    "Elphidran": "Bushi",
    "Elphidran Aqua": "Bushi",
    "Kelpsea": "Felbat",
    "Kelpsea Ignis": "Felbat",
    "Azurobe": "Bushi",
    "Cryolinx": "Mossanda",
    "Blazehowl": "Rayhound",
    "Blazehowl Noct": "Blazehowl",
    "Relaxaurus": "Grintale",
    "Relaxaurus Lux": "Azurobe",
    "Broncherry": "Chillet",
    "Broncherry Aqua": "Arsox",
    "Petallia": "Foxcicle",
    "Reptyro": "Elphidran",
    "Ice Reptyro": "Wumpo Botan",
    "Kingpaca": "Incineram",
    "Ice Kingpaca": "Incineram",
    "Mammorest": "Penking",
    "Mammorest Cryst": "Penking",
    "Wumpo": "Incineram",
    "Wumpo Botan": "Incineram",
    "Warsect": "Elphidran",
    "Fenglope": "Broncherry",
    "Felbat": "Reindrix",
    "Quivern": "Elphidran",
    "Blazamut": "Ragnahawk",
    "Helzephyr": "Wumpo",
    "Astegon": "Sibelyx",
    "Menasting": "Azurobe",
    "Anubis": "Vanwyrm",
    "Jormuntide": "Penking",
    "Jormuntide Ignis": "Penking",
    "Suzaku": "Sweepa",
    "Suzaku Aqua": "Ragnahawk",
    "Grizzbolt": "Kingpaca",
    "Lyleen": "Azurobe",
    "Lyleen Noct": "Wumpo Botan",
    "Faleris": "Surfent",
    "Orserk": "Sibelyx",
    "Shadowbeak": "Sweepa",
    "Paladius": "Sweepa",
    "Necromus": "Sweepa",
    "Frostallion": "Mossanda",
    "Frostallion Noct": "Nitewing",
    "Jetragon": "Nitewing"
  },
  "Kitsun": {
    "Lamball": "Maraith",
    "Cattiva": "Maraith",
    "Chikipi": "Wixen",
    "Lifmunk": "Rushoar",
    "Foxparks": "Lunaris",
    "Fuack": "Cawgnito",
    "Sparkit": "Leezpunk",
    "Tanzee": "Gorirat",
    "Rooby": "Verdash",
    "Pengullet": "Gobfin",
    "Penking": "Univolt",
    "Jolthog": "Lunaris",
    "Jolthog Cryst": "Gobfin",
    "Gumoss": "Galeclaw",
    "Gumoss (Special)": "Galeclaw",
    "Vixy": "Rushoar",
    "Hoocrates": "Lunaris",
    "Teafant": "Wixen",
    "Depresso": "Lunaris",
    "Cremis": "Maraith",
    "Daedream": "Galeclaw",
    "Rushoar": "Fenglope",
    "Nox": "Felbat",
    "Fuddler": "Galeclaw",
    "Killamari": "Direhowl",
    "Mau": "Rooby",
    "Mau Cryst": "Rushoar",
    "Celaray": "Digtoise",
    "Direhowl": "Loupmoon",
    "Tocotoco": "Gobfin",
    "Flopie": "Direhowl",
    "Mozzarina": "Celaray",
    "Bristla": "Cawgnito",
    "Gobfin": "Loupmoon",
    "Gobfin Ignis": "Loupmoon",
    "Hangyu": "Rushoar",
    "Hangyu Cryst": "Rushoar",
    "Mossanda": "Bushi",
    "Mossanda Lux": "Incineram",
    "Woolipop": "Felbat",
    "Caprity": "Reindrix",
    "Melpaca": "Broncherry",
    "Eikthyrdeer": "Reindrix",
    "Eikthyrdeer Terra": "Broncherry",
    "Nitewing": "Bushi",
    "Ribunny": "Beegarde",
    "Incineram": "Blazehowl",
    "Incineram Noct": "Blazehowl",
    "Cinnamoth": "Vanwyrm",
    "Arsox": "Dinossom",
    "Dumud": "Broncherry",
    "Cawgnito": "Loupmoon",
    "Leezpunk": "Fenglope",
    "Leezpunk Ignis": "Fenglope",
    "Loupmoon": "Melpaca",
    "Galeclaw": "Caprity",
    "Robinquill": "Eikthyrdeer",
    "Robinquill Terra": "Eikthyrdeer",
    "Gorirat": "Caprity",
    "Beegarde": "Loupmoon",
    "Elizabee": "Anubis",
    "Grintale": "Univolt",
    "Swee": "Direhowl",
    "Sweepa": "Bushi",
    "Chillet": "Dinossom",
    "Univolt": "Tombat",
    "Foxcicle": "Arsox",
    "Pyrin": "Incineram",
    "Pyrin Noct": "Elphidran",
    "Reindrix": "Digtoise",
    "Rayhound": "Arsox",
    "Kitsun": "Kitsun",
    "Dazzi": "Robinquill",
    "Lunaris": "Fenglope",
    "Dinossom": "Kitsun",
    "Dinossom Lux": "Dinossom",
    "Surfent": "Katress",
    "Surfent Terra": "Univolt",
    "Maraith": "Verdash",
    "Digtoise": "Digtoise",
    "Tombat": "Arsox",
    "Lovander": "Melpaca",
    "Flambelle": "Leezpunk",
    "Vanwyrm": "Tombat",
    "Vanwyrm Cryst": "Rayhound",
    "Bushi": "Rayhound",
    "Beakon": "Penking",
    "Ragnahawk": "Incineram",
    "Katress": "Foxcicle",
    "Wixen": "Verdash",
    "Verdash": "Mozzarina",
    "Vaelet": "Lovander",
    "Sibelyx": "Bushi",
    "Elphidran": "Univolt",
    "Elphidran Aqua": "Univolt",
    "Kelpsea": "Gorirat",
    "Kelpsea Ignis": "Vaelet",
    "Azurobe": "Vanwyrm",
    "Cryolinx": "Wumpo Botan",
    "Blazehowl": "Foxcicle",
    "Blazehowl Noct": "Tombat",
    "Relaxaurus": "Surfent",
    "Relaxaurus Lux": "Elphidran",
    "Broncherry": "Digtoise",
    "Broncherry Aqua": "Kitsun",
    "Petallia": "Chillet",
    "Reptyro": "Anubis",
    "Ice Reptyro": "Elphidran",
    "Kingpaca": "Vanwyrm",
    "Ice Kingpaca": "Bushi",
    "Mammorest": "Anubis",
    "Mammorest Cryst": "Surfent",
    "Wumpo": "Bushi",
    "Wumpo Botan": "Vanwyrm",
    "Warsect": "Incineram",
    "Fenglope": "Mozzarina",
    "Felbat": "Eikthyrdeer",
    "Quivern": "Incineram",
    "Blazamut": "Nitewing",
    "Helzephyr": "Grintale",
    "Astegon": "Shadowbeak",
    "Menasting": "Elphidran",
    "Anubis": "Katress",
    "Jormuntide": "Anubis",
    "Jormuntide Ignis": "Anubis",
    "Suzaku": "Sibelyx",
    "Suzaku Aqua": "Mossanda",
    "Grizzbolt": "Penking",
    "Lyleen": "Elphidran",
    "Lyleen Noct": "Penking",
    "Faleris": "Incineram",
    "Orserk": "Wumpo Botan",
    "Shadowbeak": "Sibelyx",
    "Paladius": "Sibelyx",
    "Necromus": "Sibelyx",
    "Frostallion": "Wumpo Botan",
    "Frostallion Noct": "Wumpo",
    "Jetragon": "Wumpo"
  },
  "Dazzi": {
    "Lamball": "Tocotoco",
    "Cattiva": "Tocotoco",
    "Chikipi": "Pengullet",
    "Lifmunk": "Bristla",
    "Foxparks": "Swee",
    "Fuack": "Kelpsea Ignis",
    "Sparkit": "Ribunny",
    "Tanzee": "Daedream",
    "Rooby": "Nox",
    "Pengullet": "Flopie",
    "Penking": "Broncherry",
    "Jolthog": "Killamari",
    "Jolthog Cryst": "Killamari",
    "Gumoss": "Fuddler",
    "Gumoss (Special)": "Fuddler",
    "Vixy": "Fuack",
    "Hoocrates": "Swee",
    "Teafant": "Pengullet",
    "Depresso": "Killamari",
    "Cremis": "Fuack",
    "Daedream": "Fuddler",
    "Rushoar": "Wixen",
    "Nox": "Woolipop",
    "Fuddler": "Dazzi",
    "Killamari": "Tanzee",
    "Mau": "Tocotoco",
    "Mau Cryst": "Bristla",
    "Celaray": "Gorirat",
    "Direhowl": "Rushoar",
    "Tocotoco": "Kelpsea Ignis",
    "Flopie": "Tanzee",
    "Mozzarina": "Direhowl",
    "Bristla": "Kelpsea",
    "Gobfin": "Maraith",
    "Gobfin Ignis": "Rooby",
    "Hangyu": "Bristla",
    "Hangyu Cryst": "Bristla",
    "Mossanda": "Dinossom",
    "Mossanda Lux": "Chillet",
    "Woolipop": "Dazzi",
    "Caprity": "Beegarde",
    "Melpaca": "Vaelet",
    "Eikthyrdeer": "Direhowl",
    "Eikthyrdeer Terra": "Direhowl",
    "Nitewing": "Dinossom",
    "Ribunny": "Kelpsea",
    "Incineram": "Dumud",
    "Incineram Noct": "Dumud",
    "Cinnamoth": "Digtoise",
    "Arsox": "Felbat",
    "Dumud": "Vaelet",
    "Cawgnito": "Maraith",
    "Leezpunk": "Wixen",
    "Leezpunk Ignis": "Nox",
    "Loupmoon": "Cawgnito",
    "Galeclaw": "Leezpunk",
    "Robinquill": "Lunaris",
    "Robinquill Terra": "Lunaris",
    "Gorirat": "Rushoar",
    "Beegarde": "Rushoar",
    "Elizabee": "Foxcicle",
    "Grintale": "Broncherry",
    "Swee": "Kelpsea",
    "Sweepa": "Dinossom",
    "Chillet": "Felbat",
    "Univolt": "Loupmoon",
    "Foxcicle": "Fenglope",
    "Pyrin": "Arsox",
    "Pyrin Noct": "Rayhound",
    "Reindrix": "Gorirat",
    "Rayhound": "Fenglope",
    "Kitsun": "Robinquill",
    "Dazzi": "Dazzi",
    "Lunaris": "Wixen",
    "Dinossom": "Robinquill",
    "Dinossom Lux": "Felbat",
    "Surfent": "Melpaca",
    "Surfent Terra": "Reindrix",
    "Maraith": "Nox",
    "Digtoise": "Galeclaw",
    "Tombat": "Fenglope",
    "Lovander": "Cawgnito",
    "Flambelle": "Ribunny",
    "Vanwyrm": "Caprity",
    "Vanwyrm Cryst": "Eikthyrdeer",
    "Bushi": "Eikthyrdeer",
    "Beakon": "Blazehowl",
    "Ragnahawk": "Arsox",
    "Katress": "Loupmoon",
    "Wixen": "Woolipop",
    "Verdash": "Lunaris",
    "Vaelet": "Rushoar",
    "Sibelyx": "Kitsun",
    "Elphidran": "Reindrix",
    "Elphidran Aqua": "Celaray",
    "Kelpsea": "Daedream",
    "Kelpsea Ignis": "Gumoss",
    "Azurobe": "Digtoise",
    "Cryolinx": "Univolt",
    "Blazehowl": "Loupmoon",
    "Blazehowl Noct": "Lovander",
    "Relaxaurus": "Tombat",
    "Relaxaurus Lux": "Rayhound",
    "Broncherry": "Galeclaw",
    "Broncherry Aqua": "Galeclaw",
    "Petallia": "Verdash",
    "Reptyro": "Foxcicle",
    "Ice Reptyro": "Blazehowl",
    "Kingpaca": "Digtoise",
    "Ice Kingpaca": "Kitsun",
    "Mammorest": "Tombat",
    "Mammorest Cryst": "Tombat",
    "Wumpo": "Kitsun",
    "Wumpo Botan": "Digtoise",
    "Warsect": "Petallia",
    "Fenglope": "Gobfin",
    "Felbat": "Lunaris",
    "Quivern": "Petallia",
    "Blazamut": "Incineram",
    "Helzephyr": "Katress",
    "Astegon": "Univolt",
    "Menasting": "Rayhound",
    "Anubis": "Melpaca",
    "Jormuntide": "Foxcicle",
    "Jormuntide Ignis": "Foxcicle",
    "Suzaku": "Bushi",
    "Suzaku Aqua": "Bushi",
    "Grizzbolt": "Blazehowl",
    "Lyleen": "Rayhound",
    "Lyleen Noct": "Blazehowl",
    "Faleris": "Arsox",
    "Orserk": "Univolt",
    "Shadowbeak": "Bushi",
    "Paladius": "Bushi",
    "Necromus": "Bushi",
    "Frostallion": "Vanwyrm",
    "Frostallion Noct": "Vanwyrm",
    "Jetragon": "Vanwyrm"
  },
  "Lunaris": {
    "Lamball": "Killamari",
    "Cattiva": "Killamari",
    "Chikipi": "Swee",
    "Lifmunk": "Kelpsea Ignis",
    "Foxparks": "Kelpsea",
    "Fuack": "Fuddler",
    "Sparkit": "Kelpsea",
    "Tanzee": "Nox",
    "Rooby": "Rushoar",
    "Pengullet": "Daedream",
    "Penking": "Dinossom",
    "Jolthog": "Gumoss",
    "Jolthog Cryst": "Daedream",
    "Gumoss": "Nox",
    "Gumoss (Special)": "Nox",
    "Vixy": "Flopie",
    "Hoocrates": "Tanzee",
    "Teafant": "Swee",
    "Depresso": "Tanzee",
    "Cremis": "Flopie",
    "Daedream": "Wixen",
    "Rushoar": "Leezpunk",
    "Nox": "Maraith",
    "Fuddler": "Wixen",
    "Killamari": "Dazzi",
    "Mau": "Killamari",
    "Mau Cryst": "Kelpsea Ignis",
    "Celaray": "Verdash",
    "Direhowl": "Gobfin",
    "Tocotoco": "Fuddler",
    "Flopie": "Woolipop",
    "Mozzarina": "Felbat",
    "Bristla": "Dazzi",
    "Gobfin": "Lunaris",
    "Gobfin Ignis": "Lunaris",
    "Hangyu": "Kelpsea",
    "Hangyu Cryst": "Kelpsea Ignis",
    "Mossanda": "Foxcicle",
    "Mossanda Lux": "Tombat",
    "Woolipop": "Maraith",
    "Caprity": "Robinquill",
    "Melpaca": "Felbat",
    "Eikthyrdeer": "Robinquill",
    "Eikthyrdeer Terra": "Felbat",
    "Nitewing": "Foxcicle",
    "Ribunny": "Dazzi",
    "Incineram": "Digtoise",
    "Incineram Noct": "Digtoise",
    "Cinnamoth": "Chillet",
    "Arsox": "Loupmoon",
    "Dumud": "Felbat",
    "Cawgnito": "Gobfin",
    "Leezpunk": "Lunaris",
    "Leezpunk Ignis": "Rushoar",
    "Loupmoon": "Galeclaw",
    "Galeclaw": "Beegarde",
    "Robinquill": "Direhowl",
    "Robinquill Terra": "Direhowl",
    "Gorirat": "Cawgnito",
    "Beegarde": "Gobfin",
    "Elizabee": "Blazehowl",
    "Grintale": "Dinossom",
    "Swee": "Dazzi",
    "Sweepa": "Foxcicle",
    "Chillet": "Loupmoon",
    "Univolt": "Dumud",
    "Foxcicle": "Caprity",
    "Pyrin": "Rayhound",
    "Pyrin Noct": "Univolt",
    "Reindrix": "Verdash",
    "Rayhound": "Eikthyrdeer",
    "Kitsun": "Fenglope",
    "Dazzi": "Wixen",
    "Lunaris": "Lunaris",
    "Dinossom": "Loupmoon",
    "Dinossom Lux": "Loupmoon",
    "Surfent": "Kitsun",
    "Surfent Terra": "Kitsun",
    "Maraith": "Rushoar",
    "Digtoise": "Fenglope",
    "Tombat": "Caprity",
    "Lovander": "Galeclaw",
    "Flambelle": "Kelpsea",
    "Vanwyrm": "Melpaca",
    "Vanwyrm Cryst": "Broncherry",
    "Bushi": "Reindrix",
    "Beakon": "Vanwyrm",
    "Ragnahawk": "Tombat",
    "Katress": "Mozzarina",
    "Wixen": "Rushoar",
    "Verdash": "Vaelet",
    "Vaelet": "Cawgnito",
    "Sibelyx": "Petallia",
    "Elphidran": "Kitsun",
    "Elphidran Aqua": "Dinossom",
    "Kelpsea": "Woolipop",
    "Kelpsea Ignis": "Woolipop",
    "Azurobe": "Chillet",
    "Cryolinx": "Bushi",
    "Blazehowl": "Mozzarina",
    "Blazehowl Noct": "Melpaca",
    "Relaxaurus": "Katress",
    "Relaxaurus Lux": "Univolt",
    "Broncherry": "Fenglope",
    "Broncherry Aqua": "Fenglope",
    "Petallia": "Loupmoon",
    "Reptyro": "Blazehowl",
    "Ice Reptyro": "Univolt",
    "Kingpaca": "Arsox",
    "Ice Kingpaca": "Petallia",
    "Mammorest": "Blazehowl",
    "Mammorest Cryst": "Katress",
    "Wumpo": "Arsox",
    "Wumpo Botan": "Arsox",
    "Warsect": "Rayhound",
    "Fenglope": "Gorirat",
    "Felbat": "Direhowl",
    "Quivern": "Rayhound",
    "Blazamut": "Surfent",
    "Helzephyr": "Vanwyrm",
    "Astegon": "Bushi",
    "Menasting": "Univolt",
    "Anubis": "Digtoise",
    "Jormuntide": "Blazehowl",
    "Jormuntide Ignis": "Blazehowl",
    "Suzaku": "Anubis",
    "Suzaku Aqua": "Anubis",
    "Grizzbolt": "Vanwyrm",
    "Lyleen": "Univolt",
    "Lyleen Noct": "Vanwyrm",
    "Faleris": "Rayhound",
    "Orserk": "Bushi",
    "Shadowbeak": "Incineram",
    "Paladius": "Incineram",
    "Necromus": "Incineram",
    "Frostallion": "Incineram",
    "Frostallion Noct": "Incineram",
    "Jetragon": "Incineram"
  },
  "Dinossom": {
    "Lamball": "Maraith",
    "Cattiva": "Rushoar",
    "Chikipi": "Wixen",
    "Lifmunk": "Rushoar",
    "Foxparks": "Lunaris",
    "Fuack": "Cawgnito",
    "Sparkit": "Lunaris",
    "Tanzee": "Galeclaw",
    "Rooby": "Verdash",
    "Pengullet": "Gobfin",
    "Penking": "Univolt",
    "Jolthog": "Gobfin",
    "Jolthog Cryst": "Gobfin",
    "Gumoss": "Galeclaw",
    "Gumoss (Special)": "Galeclaw",
    "Vixy": "Rushoar",
    "Hoocrates": "Lunaris",
    "Teafant": "Rooby",
    "Depresso": "Lunaris",
    "Cremis": "Rushoar",
    "Daedream": "Galeclaw",
    "Rushoar": "Fenglope",
    "Nox": "Felbat",
    "Fuddler": "Robinquill",
    "Killamari": "Direhowl",
    "Mau": "Maraith",
    "Mau Cryst": "Rushoar",
    "Celaray": "Digtoise",
    "Direhowl": "Lovander",
    "Tocotoco": "Cawgnito",
    "Flopie": "Vaelet",
    "Mozzarina": "Broncherry",
    "Bristla": "Beegarde",
    "Gobfin": "Loupmoon",
    "Gobfin Ignis": "Loupmoon",
    "Hangyu": "Leezpunk",
    "Hangyu Cryst": "Leezpunk",
    "Mossanda": "Bushi",
    "Mossanda Lux": "Incineram",
    "Woolipop": "Felbat",
    "Caprity": "Reindrix",
    "Melpaca": "Digtoise",
    "Eikthyrdeer": "Celaray",
    "Eikthyrdeer Terra": "Broncherry",
    "Nitewing": "Bushi",
    "Ribunny": "Direhowl",
    "Incineram": "Blazehowl",
    "Incineram Noct": "Katress",
    "Cinnamoth": "Vanwyrm",
    "Arsox": "Chillet",
    "Dumud": "Broncherry",
    "Cawgnito": "Loupmoon",
    "Leezpunk": "Fenglope",
    "Leezpunk Ignis": "Fenglope",
    "Loupmoon": "Melpaca",
    "Galeclaw": "Eikthyrdeer",
    "Robinquill": "Eikthyrdeer",
    "Robinquill Terra": "Mozzarina",
    "Gorirat": "Caprity",
    "Beegarde": "Loupmoon",
    "Elizabee": "Anubis",
    "Grintale": "Vanwyrm",
    "Swee": "Direhowl",
    "Sweepa": "Incineram",
    "Chillet": "Dinossom",
    "Univolt": "Tombat",
    "Foxcicle": "Arsox",
    "Pyrin": "Incineram",
    "Pyrin Noct": "Elphidran",
    "Reindrix": "Digtoise",
    "Rayhound": "Dinossom Lux",
    "Kitsun": "Kitsun",
    "Dazzi": "Robinquill",
    "Lunaris": "Loupmoon",
    "Dinossom": "Dinossom",
    "Dinossom Lux": "Dinossom",
    "Surfent": "Univolt",
    "Surfent Terra": "Univolt",
    "Maraith": "Fenglope",
    "Digtoise": "Kitsun",
    "Tombat": "Arsox",
    "Lovander": "Reindrix",
    "Flambelle": "Lunaris",
    "Vanwyrm": "Rayhound",
    "Vanwyrm Cryst": "Blazehowl",
    "Bushi": "Rayhound",
    "Beakon": "Penking",
    "Ragnahawk": "Incineram",
    "Katress": "Foxcicle",
    "Wixen": "Verdash",
    "Verdash": "Mozzarina",
    "Vaelet": "Caprity",
    "Sibelyx": "Bushi",
    "Elphidran": "Univolt",
    "Elphidran Aqua": "Univolt",
    "Kelpsea": "Gorirat",
    "Kelpsea Ignis": "Gorirat",
    "Azurobe": "Vanwyrm",
    "Cryolinx": "Wumpo Botan",
    "Blazehowl": "Foxcicle",
    "Blazehowl Noct": "Tombat",
    "Relaxaurus": "Elphidran",
    "Relaxaurus Lux": "Elphidran",
    "Broncherry": "Digtoise",
    "Broncherry Aqua": "Kitsun",
    "Petallia": "Chillet",
    "Reptyro": "Anubis",
    "Ice Reptyro": "Penking",
    "Kingpaca": "Bushi",
    "Ice Kingpaca": "Bushi",
    "Mammorest": "Surfent",
    "Mammorest Cryst": "Surfent",
    "Wumpo": "Bushi",
    "Wumpo Botan": "Vanwyrm",
    "Warsect": "Anubis",
    "Fenglope": "Dumud",
    "Felbat": "Eikthyrdeer",
    "Quivern": "Incineram",
    "Blazamut": "Nitewing",
    "Helzephyr": "Azurobe",
    "Astegon": "Wumpo Botan",
    "Menasting": "Elphidran",
    "Anubis": "Katress",
    "Jormuntide": "Anubis",
    "Jormuntide Ignis": "Anubis",
    "Suzaku": "Mossanda",
    "Suzaku Aqua": "Nitewing",
    "Grizzbolt": "Grintale",
    "Lyleen": "Elphidran",
    "Lyleen Noct": "Penking",
    "Faleris": "Incineram",
    "Orserk": "Wumpo Botan",
    "Shadowbeak": "Sibelyx",
    "Paladius": "Sibelyx",
    "Necromus": "Sibelyx",
    "Frostallion": "Kingpaca",
    "Frostallion Noct": "Wumpo",
    "Jetragon": "Sibelyx"
  },
  "Dinossom Lux": {
    "variant": true,
    "Lamball": "Rushoar",
    "Cattiva": "Rushoar",
    "Chikipi": "Rooby",
    "Lifmunk": "Leezpunk",
    "Foxparks": "Lunaris",
    "Fuack": "Beegarde",
    "Sparkit": "Lunaris",
    "Tanzee": "Galeclaw",
    "Rooby": "Fenglope",
    "Pengullet": "Cawgnito",
    "Penking": "Vanwyrm",
    "Jolthog": "Gobfin",
    "Jolthog Cryst": "Gobfin",
    "Gumoss": "Galeclaw",
    "Gumoss (Special)": "Galeclaw",
    "Vixy": "Rushoar",
    "Hoocrates": "Lunaris",
    "Teafant": "Maraith",
    "Depresso": "Gobfin",
    "Cremis": "Rushoar",
    "Daedream": "Robinquill",
    "Rushoar": "Fenglope",
    "Nox": "Verdash",
    "Fuddler": "Robinquill",
    "Killamari": "Vaelet",
    "Mau": "Maraith",
    "Mau Cryst": "Rushoar",
    "Celaray": "Digtoise",
    "Direhowl": "Caprity",
    "Tocotoco": "Cawgnito",
    "Flopie": "Gorirat",
    "Mozzarina": "Broncherry",
    "Bristla": "Direhowl",
    "Gobfin": "Loupmoon",
    "Gobfin Ignis": "Loupmoon",
    "Hangyu": "Lunaris",
    "Hangyu Cryst": "Leezpunk",
    "Mossanda": "Bushi",
    "Mossanda Lux": "Incineram",
    "Woolipop": "Felbat",
    "Caprity": "Celaray",
    "Melpaca": "Digtoise",
    "Eikthyrdeer": "Broncherry",
    "Eikthyrdeer Terra": "Digtoise",
    "Nitewing": "Incineram",
    "Ribunny": "Direhowl",
    "Incineram": "Katress",
    "Incineram Noct": "Katress",
    "Cinnamoth": "Vanwyrm",
    "Arsox": "Chillet",
    "Dumud": "Digtoise",
    "Cawgnito": "Loupmoon",
    "Leezpunk": "Loupmoon",
    "Leezpunk Ignis": "Fenglope",
    "Loupmoon": "Reindrix",
    "Galeclaw": "Eikthyrdeer",
    "Robinquill": "Eikthyrdeer",
    "Robinquill Terra": "Mozzarina",
    "Gorirat": "Eikthyrdeer",
    "Beegarde": "Lovander",
    "Elizabee": "Anubis",
    "Grintale": "Vanwyrm",
    "Swee": "Direhowl",
    "Sweepa": "Incineram",
    "Chillet": "Chillet",
    "Univolt": "Tombat",
    "Foxcicle": "Arsox",
    "Pyrin": "Incineram",
    "Pyrin Noct": "Penking",
    "Reindrix": "Digtoise",
    "Rayhound": "Petallia",
    "Kitsun": "Dinossom",
    "Dazzi": "Felbat",
    "Lunaris": "Loupmoon",
    "Dinossom": "Dinossom",
    "Dinossom Lux": "Dinossom Lux",
    "Surfent": "Univolt",
    "Surfent Terra": "Univolt",
    "Maraith": "Fenglope",
    "Digtoise": "Kitsun",
    "Tombat": "Petallia",
    "Lovander": "Reindrix",
    "Flambelle": "Lunaris",
    "Vanwyrm": "Rayhound",
    "Vanwyrm Cryst": "Blazehowl",
    "Bushi": "Rayhound",
    "Beakon": "Penking",
    "Ragnahawk": "Incineram",
    "Katress": "Tombat",
    "Wixen": "Fenglope",
    "Verdash": "Dumud",
    "Vaelet": "Caprity",
    "Sibelyx": "Bushi",
    "Elphidran": "Univolt",
    "Elphidran Aqua": "Univolt",
    "Kelpsea": "Galeclaw",
    "Kelpsea Ignis": "Gorirat",
    "Azurobe": "Vanwyrm",
    "Cryolinx": "Kingpaca",
    "Blazehowl": "Foxcicle",
    "Blazehowl Noct": "Rayhound",
    "Relaxaurus": "Elphidran",
    "Relaxaurus Lux": "Elphidran",
    "Broncherry": "Kitsun",
    "Broncherry Aqua": "Kitsun",
    "Petallia": "Arsox",
    "Reptyro": "Anubis",
    "Ice Reptyro": "Penking",
    "Kingpaca": "Bushi",
    "Ice Kingpaca": "Bushi",
    "Mammorest": "Surfent",
    "Mammorest Cryst": "Elphidran",
    "Wumpo": "Bushi",
    "Wumpo Botan": "Bushi",
    "Warsect": "Anubis",
    "Fenglope": "Dumud",
    "Felbat": "Mozzarina",
    "Quivern": "Anubis",
    "Blazamut": "Sweepa",
    "Helzephyr": "Azurobe",
    "Astegon": "Wumpo Botan",
    "Menasting": "Elphidran",
    "Anubis": "Univolt",
    "Jormuntide": "Surfent",
    "Jormuntide Ignis": "Surfent",
    "Suzaku": "Mossanda",
    "Suzaku Aqua": "Nitewing",
    "Grizzbolt": "Azurobe",
    "Lyleen": "Elphidran",
    "Lyleen Noct": "Grintale",
    "Faleris": "Incineram",
    "Orserk": "Wumpo Botan",
    "Shadowbeak": "Mossanda",
    "Paladius": "Sibelyx",
    "Necromus": "Sibelyx",
    "Frostallion": "Wumpo",
    "Frostallion Noct": "Sibelyx",
    "Jetragon": "Sibelyx"
  },
  "Surfent": {
    "Lamball": "Robinquill",
    "Cattiva": "Felbat",
    "Chikipi": "Galeclaw",
    "Lifmunk": "Verdash",
    "Foxparks": "Fenglope",
    "Fuack": "Loupmoon",
    "Sparkit": "Fenglope",
    "Tanzee": "Mozzarina",
    "Rooby": "Broncherry",
    "Pengullet": "Loupmoon",
    "Penking": "Elphidran",
    "Jolthog": "Loupmoon",
    "Jolthog Cryst": "Loupmoon",
    "Gumoss": "Dumud",
    "Gumoss (Special)": "Dumud",
    "Vixy": "Felbat",
    "Hoocrates": "Fenglope",
    "Teafant": "Galeclaw",
    "Depresso": "Fenglope",
    "Cremis": "Felbat",
    "Daedream": "Dumud",
    "Rushoar": "Digtoise",
    "Nox": "Celaray",
    "Fuddler": "Melpaca",
    "Killamari": "Eikthyrdeer",
    "Mau": "Robinquill",
    "Mau Cryst": "Felbat",
    "Celaray": "Blazehowl",
    "Direhowl": "Dinossom",
    "Tocotoco": "Loupmoon",
    "Flopie": "Eikthyrdeer",
    "Mozzarina": "Rayhound",
    "Bristla": "Lovander",
    "Gobfin": "Kitsun",
    "Gobfin Ignis": "Kitsun",
    "Hangyu": "Verdash",
    "Hangyu Cryst": "Verdash",
    "Mossanda": "Azurobe",
    "Mossanda Lux": "Wumpo Botan",
    "Woolipop": "Reindrix",
    "Caprity": "Tombat",
    "Melpaca": "Rayhound",
    "Eikthyrdeer": "Rayhound",
    "Eikthyrdeer Terra": "Rayhound",
    "Nitewing": "Cinnamoth",
    "Ribunny": "Caprity",
    "Incineram": "Anubis",
    "Incineram Noct": "Anubis",
    "Cinnamoth": "Penking",
    "Arsox": "Univolt",
    "Dumud": "Surfent Terra",
    "Cawgnito": "Dinossom",
    "Leezpunk": "Digtoise",
    "Leezpunk Ignis": "Digtoise",
    "Loupmoon": "Tombat",
    "Galeclaw": "Arsox",
    "Robinquill": "Arsox",
    "Robinquill Terra": "Petallia",
    "Gorirat": "Chillet",
    "Beegarde": "Dinossom",
    "Elizabee": "Sibelyx",
    "Grintale": "Elphidran",
    "Swee": "Caprity",
    "Sweepa": "Wumpo Botan",
    "Chillet": "Univolt",
    "Univolt": "Bushi",
    "Foxcicle": "Vanwyrm",
    "Pyrin": "Wumpo",
    "Pyrin Noct": "Sweepa",
    "Reindrix": "Blazehowl",
    "Rayhound": "Vanwyrm",
    "Kitsun": "Katress",
    "Dazzi": "Melpaca",
    "Lunaris": "Kitsun",
    "Dinossom": "Univolt",
    "Dinossom Lux": "Univolt",
    "Surfent": "Surfent",
    "Surfent Terra": "Surfent",
    "Maraith": "Digtoise",
    "Digtoise": "Blazehowl",
    "Tombat": "Vanwyrm",
    "Lovander": "Tombat",
    "Flambelle": "Fenglope",
    "Vanwyrm": "Incineram",
    "Vanwyrm Cryst": "Incineram",
    "Bushi": "Incineram",
    "Beakon": "Ragnahawk",
    "Ragnahawk": "Kingpaca",
    "Katress": "Bushi",
    "Wixen": "Broncherry",
    "Verdash": "Petallia",
    "Vaelet": "Chillet",
    "Sibelyx": "Azurobe",
    "Elphidran": "Elphidran Aqua",
    "Elphidran Aqua": "Elphidran",
    "Kelpsea": "Mozzarina",
    "Kelpsea Ignis": "Eikthyrdeer",
    "Azurobe": "Elphidran",
    "Cryolinx": "Warsect",
    "Blazehowl": "Bushi",
    "Blazehowl Noct": "Incineram",
    "Relaxaurus": "Nitewing",
    "Relaxaurus Lux": "Nitewing",
    "Broncherry": "Blazehowl",
    "Broncherry Aqua": "Katress",
    "Petallia": "Univolt",
    "Reptyro": "Sibelyx",
    "Ice Reptyro": "Sweepa",
    "Kingpaca": "Penking",
    "Ice Kingpaca": "Azurobe",
    "Mammorest": "Mossanda",
    "Mammorest Cryst": "Nitewing",
    "Wumpo": "Grintale",
    "Wumpo Botan": "Penking",
    "Warsect": "Sibelyx",
    "Fenglope": "Foxcicle",
    "Felbat": "Arsox",
    "Quivern": "Sibelyx",
    "Blazamut": "Relaxaurus",
    "Helzephyr": "Ragnahawk",
    "Astegon": "Pyrin",
    "Menasting": "Sweepa",
    "Anubis": "Anubis",
    "Jormuntide": "Mossanda",
    "Jormuntide Ignis": "Mossanda",
    "Suzaku": "Jormuntide",
    "Suzaku Aqua": "Mammorest",
    "Grizzbolt": "Ragnahawk",
    "Lyleen": "Sweepa",
    "Lyleen Noct": "Ragnahawk",
    "Faleris": "Wumpo",
    "Orserk": "Quivern",
    "Shadowbeak": "Jormuntide",
    "Paladius": "Reptyro",
    "Necromus": "Jormuntide",
    "Frostallion": "Warsect",
    "Frostallion Noct": "Elizabee",
    "Jetragon": "Reptyro"
  },
  "Surfent Terra": {
    "variant": true,
    "Lamball": "Felbat",
    "Cattiva": "Felbat",
    "Chikipi": "Galeclaw",
    "Lifmunk": "Verdash",
    "Foxparks": "Fenglope",
    "Fuack": "Lovander",
    "Sparkit": "Fenglope",
    "Tanzee": "Dumud",
    "Rooby": "Digtoise",
    "Pengullet": "Loupmoon",
    "Penking": "Elphidran",
    "Jolthog": "Loupmoon",
    "Jolthog Cryst": "Loupmoon",
    "Gumoss": "Dumud",
    "Gumoss (Special)": "Dumud",
    "Vixy": "Felbat",
    "Hoocrates": "Fenglope",
    "Teafant": "Robinquill",
    "Depresso": "Loupmoon",
    "Cremis": "Felbat",
    "Daedream": "Melpaca",
    "Rushoar": "Digtoise",
    "Nox": "Broncherry",
    "Fuddler": "Melpaca",
    "Killamari": "Eikthyrdeer",
    "Mau": "Robinquill",
    "Mau Cryst": "Verdash",
    "Celaray": "Blazehowl",
    "Direhowl": "Chillet",
    "Tocotoco": "Loupmoon",
    "Flopie": "Eikthyrdeer",
    "Mozzarina": "Rayhound",
    "Bristla": "Caprity",
    "Gobfin": "Dinossom",
    "Gobfin Ignis": "Kitsun",
    "Hangyu": "Fenglope",
    "Hangyu Cryst": "Verdash",
    "Mossanda": "Cinnamoth",
    "Mossanda Lux": "Kingpaca",
    "Woolipop": "Celaray",
    "Caprity": "Rayhound",
    "Melpaca": "Blazehowl",
    "Eikthyrdeer": "Rayhound",
    "Eikthyrdeer Terra": "Rayhound",
    "Nitewing": "Wumpo Botan",
    "Ribunny": "Caprity",
    "Incineram": "Anubis",
    "Incineram Noct": "Anubis",
    "Cinnamoth": "Penking",
    "Arsox": "Univolt",
    "Dumud": "Blazehowl",
    "Cawgnito": "Dinossom",
    "Leezpunk": "Kitsun",
    "Leezpunk Ignis": "Digtoise",
    "Loupmoon": "Tombat",
    "Galeclaw": "Arsox",
    "Robinquill": "Arsox",
    "Robinquill Terra": "Petallia",
    "Gorirat": "Arsox",
    "Beegarde": "Dinossom",
    "Elizabee": "Sibelyx",
    "Grintale": "Elphidran",
    "Swee": "Eikthyrdeer",
    "Sweepa": "Wumpo Botan",
    "Chillet": "Univolt",
    "Univolt": "Incineram",
    "Foxcicle": "Vanwyrm",
    "Pyrin": "Sibelyx",
    "Pyrin Noct": "Sweepa",
    "Reindrix": "Blazehowl",
    "Rayhound": "Bushi",
    "Kitsun": "Univolt",
    "Dazzi": "Reindrix",
    "Lunaris": "Kitsun",
    "Dinossom": "Univolt",
    "Dinossom Lux": "Univolt",
    "Surfent": "Surfent",
    "Surfent Terra": "Surfent Terra",
    "Maraith": "Digtoise",
    "Digtoise": "Katress",
    "Tombat": "Vanwyrm",
    "Lovander": "Tombat",
    "Flambelle": "Fenglope",
    "Vanwyrm": "Incineram",
    "Vanwyrm Cryst": "Incineram",
    "Bushi": "Incineram",
    "Beakon": "Ragnahawk",
    "Ragnahawk": "Wumpo",
    "Katress": "Bushi",
    "Wixen": "Digtoise",
    "Verdash": "Foxcicle",
    "Vaelet": "Chillet",
    "Sibelyx": "Azurobe",
    "Elphidran": "Elphidran",
    "Elphidran Aqua": "Elphidran",
    "Kelpsea": "Mozzarina",
    "Kelpsea Ignis": "Mozzarina",
    "Azurobe": "Penking",
    "Cryolinx": "Warsect",
    "Blazehowl": "Bushi",
    "Blazehowl Noct": "Incineram",
    "Relaxaurus": "Nitewing",
    "Relaxaurus Lux": "Sweepa",
    "Broncherry": "Blazehowl",
    "Broncherry Aqua": "Katress",
    "Petallia": "Vanwyrm",
    "Reptyro": "Mossanda",
    "Ice Reptyro": "Ragnahawk",
    "Kingpaca": "Grintale",
    "Ice Kingpaca": "Azurobe",
    "Mammorest": "Nitewing",
    "Mammorest Cryst": "Nitewing",
    "Wumpo": "Azurobe",
    "Wumpo Botan": "Penking",
    "Warsect": "Sibelyx",
    "Fenglope": "Foxcicle",
    "Felbat": "Petallia",
    "Quivern": "Sibelyx",
    "Blazamut": "Relaxaurus",
    "Helzephyr": "Pyrin",
    "Astegon": "Quivern",
    "Menasting": "Sweepa",
    "Anubis": "Surfent",
    "Jormuntide": "Mossanda",
    "Jormuntide Ignis": "Mossanda",
    "Suzaku": "Mammorest",
    "Suzaku Aqua": "Relaxaurus",
    "Grizzbolt": "Ragnahawk",
    "Lyleen": "Sweepa",
    "Lyleen Noct": "Ragnahawk",
    "Faleris": "Wumpo",
    "Orserk": "Warsect",
    "Shadowbeak": "Jormuntide",
    "Paladius": "Jormuntide",
    "Necromus": "Jormuntide",
    "Frostallion": "Elizabee",
    "Frostallion Noct": "Reptyro",
    "Jetragon": "Reptyro"
  },
  "Maraith": {
    "Lamball": "Ribunny",
    "Cattiva": "Swee",
    "Chikipi": "Bristla",
    "Lifmunk": "Killamari",
    "Foxparks": "Kelpsea Ignis",
    "Fuack": "Gumoss",
    "Sparkit": "Flopie",
    "Tanzee": "Dazzi",
    "Rooby": "Rooby",
    "Pengullet": "Tanzee",
    "Penking": "Kitsun",
    "Jolthog": "Kelpsea",
    "Jolthog Cryst": "Kelpsea",
    "Gumoss": "Woolipop",
    "Gumoss (Special)": "Woolipop",
    "Vixy": "Swee",
    "Hoocrates": "Kelpsea Ignis",
    "Teafant": "Bristla",
    "Depresso": "Kelpsea",
    "Cremis": "Swee",
    "Daedream": "Woolipop",
    "Rushoar": "Rushoar",
    "Nox": "Wixen",
    "Fuddler": "Woolipop",
    "Killamari": "Fuddler",
    "Mau": "Bristla",
    "Mau Cryst": "Killamari",
    "Celaray": "Felbat",
    "Direhowl": "Lunaris",
    "Tocotoco": "Tanzee",
    "Flopie": "Dazzi",
    "Mozzarina": "Galeclaw",
    "Bristla": "Daedream",
    "Gobfin": "Leezpunk",
    "Gobfin Ignis": "Rushoar",
    "Hangyu": "Killamari",
    "Hangyu Cryst": "Killamari",
    "Mossanda": "Arsox",
    "Mossanda Lux": "Foxcicle",
    "Woolipop": "Wixen",
    "Caprity": "Gorirat",
    "Melpaca": "Robinquill",
    "Eikthyrdeer": "Galeclaw",
    "Eikthyrdeer Terra": "Galeclaw",
    "Nitewing": "Arsox",
    "Ribunny": "Daedream",
    "Incineram": "Incineram Noct",
    "Incineram Noct": "Broncherry",
    "Cinnamoth": "Dinossom",
    "Arsox": "Fenglope",
    "Dumud": "Robinquill",
    "Cawgnito": "Lunaris",
    "Leezpunk": "Rushoar",
    "Leezpunk Ignis": "Maraith",
    "Loupmoon": "Vaelet",
    "Galeclaw": "Gobfin",
    "Robinquill": "Gobfin",
    "Robinquill Terra": "Cawgnito",
    "Gorirat": "Gobfin",
    "Beegarde": "Lunaris",
    "Elizabee": "Rayhound",
    "Grintale": "Kitsun",
    "Swee": "Fuddler",
    "Sweepa": "Petallia",
    "Chillet": "Fenglope",
    "Univolt": "Eikthyrdeer",
    "Foxcicle": "Loupmoon",
    "Pyrin": "Tombat",
    "Pyrin Noct": "Katress",
    "Reindrix": "Robinquill",
    "Rayhound": "Loupmoon",
    "Kitsun": "Verdash",
    "Dazzi": "Nox",
    "Lunaris": "Rushoar",
    "Dinossom": "Fenglope",
    "Dinossom Lux": "Fenglope",
    "Surfent": "Digtoise",
    "Surfent Terra": "Digtoise",
    "Maraith": "Maraith",
    "Digtoise": "Felbat",
    "Tombat": "Loupmoon",
    "Lovander": "Gorirat",
    "Flambelle": "Flopie",
    "Vanwyrm": "Mozzarina",
    "Vanwyrm Cryst": "Melpaca",
    "Bushi": "Dumud",
    "Beakon": "Univolt",
    "Ragnahawk": "Foxcicle",
    "Katress": "Eikthyrdeer",
    "Wixen": "Rooby",
    "Verdash": "Beegarde",
    "Vaelet": "Lunaris",
    "Sibelyx": "Chillet",
    "Elphidran": "Digtoise",
    "Elphidran Aqua": "Digtoise",
    "Kelpsea": "Dazzi",
    "Kelpsea Ignis": "Dazzi",
    "Azurobe": "Kitsun",
    "Cryolinx": "Bushi",
    "Blazehowl": "Caprity",
    "Blazehowl Noct": "Mozzarina",
    "Relaxaurus": "Blazehowl",
    "Relaxaurus Lux": "Blazehowl",
    "Broncherry": "Felbat",
    "Broncherry Aqua": "Verdash",
    "Petallia": "Loupmoon",
    "Reptyro": "Rayhound",
    "Ice Reptyro": "Univolt",
    "Kingpaca": "Dinossom",
    "Ice Kingpaca": "Arsox",
    "Mammorest": "Rayhound",
    "Mammorest Cryst": "Blazehowl",
    "Wumpo": "Chillet",
    "Wumpo Botan": "Dinossom",
    "Warsect": "Tombat",
    "Fenglope": "Direhowl",
    "Felbat": "Cawgnito",
    "Quivern": "Tombat",
    "Blazamut": "Anubis",
    "Helzephyr": "Univolt",
    "Astegon": "Vanwyrm",
    "Menasting": "Blazehowl",
    "Anubis": "Broncherry",
    "Jormuntide": "Rayhound",
    "Jormuntide Ignis": "Rayhound",
    "Suzaku": "Incineram",
    "Suzaku Aqua": "Incineram",
    "Grizzbolt": "Univolt",
    "Lyleen": "Katress",
    "Lyleen Noct": "Univolt",
    "Faleris": "Foxcicle",
    "Orserk": "Bushi",
    "Shadowbeak": "Incineram",
    "Paladius": "Incineram",
    "Necromus": "Incineram",
    "Frostallion": "Bushi",
    "Frostallion Noct": "Bushi",
    "Jetragon": "Bushi"
  },
  "Digtoise": {
    "Lamball": "Wixen",
    "Cattiva": "Rooby",
    "Chikipi": "Nox",
    "Lifmunk": "Rushoar",
    "Foxparks": "Rushoar",
    "Fuack": "Gobfin",
    "Sparkit": "Rushoar",
    "Tanzee": "Vaelet",
    "Rooby": "Felbat",
    "Pengullet": "Lunaris",
    "Penking": "Univolt",
    "Jolthog": "Lunaris",
    "Jolthog Cryst": "Lunaris",
    "Gumoss": "Gorirat",
    "Gumoss (Special)": "Gorirat",
    "Vixy": "Maraith",
    "Hoocrates": "Leezpunk",
    "Teafant": "Wixen",
    "Depresso": "Lunaris",
    "Cremis": "Rooby",
    "Daedream": "Gorirat",
    "Rushoar": "Verdash",
    "Nox": "Robinquill",
    "Fuddler": "Galeclaw",
    "Killamari": "Beegarde",
    "Mau": "Wixen",
    "Mau Cryst": "Maraith",
    "Celaray": "Broncherry",
    "Direhowl": "Loupmoon",
    "Tocotoco": "Gobfin",
    "Flopie": "Direhowl",
    "Mozzarina": "Reindrix",
    "Bristla": "Gobfin",
    "Gobfin": "Fenglope",
    "Gobfin Ignis": "Fenglope",
    "Hangyu": "Rushoar",
    "Hangyu Cryst": "Rushoar",
    "Mossanda": "Bushi",
    "Mossanda Lux": "Bushi",
    "Woolipop": "Robinquill",
    "Caprity": "Melpaca",
    "Melpaca": "Celaray",
    "Eikthyrdeer": "Melpaca",
    "Eikthyrdeer Terra": "Reindrix",
    "Nitewing": "Bushi",
    "Ribunny": "Cawgnito",
    "Incineram": "Blazehowl",
    "Incineram Noct": "Blazehowl",
    "Cinnamoth": "Univolt",
    "Arsox": "Dinossom",
    "Dumud": "Celaray",
    "Cawgnito": "Loupmoon",
    "Leezpunk": "Fenglope",
    "Leezpunk Ignis": "Verdash",
    "Loupmoon": "Dumud",
    "Galeclaw": "Lovander",
    "Robinquill": "Caprity",
    "Robinquill Terra": "Eikthyrdeer",
    "Gorirat": "Loupmoon",
    "Beegarde": "Loupmoon",
    "Elizabee": "Incineram",
    "Grintale": "Univolt",
    "Swee": "Cawgnito",
    "Sweepa": "Bushi",
    "Chillet": "Kitsun",
    "Univolt": "Foxcicle",
    "Foxcicle": "Chillet",
    "Pyrin": "Incineram",
    "Pyrin Noct": "Elphidran",
    "Reindrix": "Broncherry",
    "Rayhound": "Arsox",
    "Kitsun": "Digtoise",
    "Dazzi": "Galeclaw",
    "Lunaris": "Fenglope",
    "Dinossom": "Kitsun",
    "Dinossom Lux": "Kitsun",
    "Surfent": "Blazehowl",
    "Surfent Terra": "Katress",
    "Maraith": "Felbat",
    "Digtoise": "Digtoise",
    "Tombat": "Chillet",
    "Lovander": "Dumud",
    "Flambelle": "Rushoar",
    "Vanwyrm": "Tombat",
    "Vanwyrm Cryst": "Rayhound",
    "Bushi": "Tombat",
    "Beakon": "Elphidran",
    "Ragnahawk": "Incineram",
    "Katress": "Petallia",
    "Wixen": "Felbat",
    "Verdash": "Eikthyrdeer",
    "Vaelet": "Loupmoon",
    "Sibelyx": "Vanwyrm",
    "Elphidran": "Katress",
    "Elphidran Aqua": "Univolt",
    "Kelpsea": "Direhowl",
    "Kelpsea Ignis": "Direhowl",
    "Azurobe": "Univolt",
    "Cryolinx": "Cinnamoth",
    "Blazehowl": "Petallia",
    "Blazehowl Noct": "Foxcicle",
    "Relaxaurus": "Anubis",
    "Relaxaurus Lux": "Surfent",
    "Broncherry": "Digtoise",
    "Broncherry Aqua": "Digtoise",
    "Petallia": "Dinossom",
    "Reptyro": "Incineram",
    "Ice Reptyro": "Elphidran",
    "Kingpaca": "Vanwyrm",
    "Ice Kingpaca": "Bushi",
    "Mammorest": "Anubis",
    "Mammorest Cryst": "Anubis",
    "Wumpo": "Vanwyrm",
    "Wumpo Botan": "Vanwyrm",
    "Warsect": "Incineram",
    "Fenglope": "Eikthyrdeer",
    "Felbat": "Caprity",
    "Quivern": "Incineram",
    "Blazamut": "Mossanda",
    "Helzephyr": "Penking",
    "Astegon": "Azurobe",
    "Menasting": "Surfent",
    "Anubis": "Blazehowl",
    "Jormuntide": "Anubis",
    "Jormuntide Ignis": "Incineram",
    "Suzaku": "Sibelyx",
    "Suzaku Aqua": "Sibelyx",
    "Grizzbolt": "Penking",
    "Lyleen": "Elphidran",
    "Lyleen Noct": "Elphidran",
    "Faleris": "Incineram",
    "Orserk": "Azurobe",
    "Shadowbeak": "Sibelyx",
    "Paladius": "Wumpo",
    "Necromus": "Wumpo",
    "Frostallion": "Wumpo Botan",
    "Frostallion Noct": "Wumpo Botan",
    "Jetragon": "Kingpaca"
  },
  "Tombat": {
    "Lamball": "Lunaris",
    "Cattiva": "Lunaris",
    "Chikipi": "Rushoar",
    "Lifmunk": "Gobfin",
    "Foxparks": "Cawgnito",
    "Fuack": "Gorirat",
    "Sparkit": "Cawgnito",
    "Tanzee": "Felbat",
    "Rooby": "Loupmoon",
    "Pengullet": "Vaelet",
    "Penking": "Bushi",
    "Jolthog": "Direhowl",
    "Jolthog Cryst": "Direhowl",
    "Gumoss": "Verdash",
    "Gumoss (Special)": "Verdash",
    "Vixy": "Lunaris",
    "Hoocrates": "Beegarde",
    "Teafant": "Leezpunk",
    "Depresso": "Direhowl",
    "Cremis": "Lunaris",
    "Daedream": "Verdash",
    "Rushoar": "Lovander",
    "Nox": "Loupmoon",
    "Fuddler": "Fenglope",
    "Killamari": "Robinquill",
    "Mau": "Lunaris",
    "Mau Cryst": "Gobfin",
    "Celaray": "Dinossom",
    "Direhowl": "Mozzarina",
    "Tocotoco": "Gorirat",
    "Flopie": "Robinquill",
    "Mozzarina": "Kitsun",
    "Bristla": "Galeclaw",
    "Gobfin": "Eikthyrdeer",
    "Gobfin Ignis": "Eikthyrdeer",
    "Hangyu": "Gobfin",
    "Hangyu Cryst": "Gobfin",
    "Mossanda": "Incineram",
    "Mossanda Lux": "Anubis",
    "Woolipop": "Fenglope",
    "Caprity": "Digtoise",
    "Melpaca": "Dinossom",
    "Eikthyrdeer": "Kitsun",
    "Eikthyrdeer Terra": "Kitsun",
    "Nitewing": "Incineram",
    "Ribunny": "Galeclaw",
    "Incineram": "Univolt",
    "Incineram Noct": "Vanwyrm",
    "Cinnamoth": "Bushi",
    "Arsox": "Foxcicle",
    "Dumud": "Dinossom",
    "Cawgnito": "Eikthyrdeer",
    "Leezpunk": "Caprity",
    "Leezpunk Ignis": "Loupmoon",
    "Loupmoon": "Digtoise",
    "Galeclaw": "Melpaca",
    "Robinquill": "Melpaca",
    "Robinquill Terra": "Reindrix",
    "Gorirat": "Dumud",
    "Beegarde": "Mozzarina",
    "Elizabee": "Elphidran",
    "Grintale": "Bushi",
    "Swee": "Galeclaw",
    "Sweepa": "Anubis",
    "Chillet": "Petallia",
    "Univolt": "Blazehowl",
    "Foxcicle": "Tombat",
    "Pyrin": "Surfent",
    "Pyrin Noct": "Azurobe",
    "Reindrix": "Dinossom",
    "Rayhound": "Tombat",
    "Kitsun": "Arsox",
    "Dazzi": "Fenglope",
    "Lunaris": "Caprity",
    "Dinossom": "Arsox",
    "Dinossom Lux": "Petallia",
    "Surfent": "Vanwyrm",
    "Surfent Terra": "Vanwyrm",
    "Maraith": "Loupmoon",
    "Digtoise": "Chillet",
    "Tombat": "Tombat",
    "Lovander": "Digtoise",
    "Flambelle": "Cawgnito",
    "Vanwyrm": "Blazehowl",
    "Vanwyrm Cryst": "Univolt",
    "Bushi": "Katress",
    "Beakon": "Wumpo Botan",
    "Ragnahawk": "Anubis",
    "Katress": "Rayhound",
    "Wixen": "Loupmoon",
    "Verdash": "Celaray",
    "Vaelet": "Dumud",
    "Sibelyx": "Incineram",
    "Elphidran": "Bushi",
    "Elphidran Aqua": "Bushi",
    "Kelpsea": "Felbat",
    "Kelpsea Ignis": "Felbat",
    "Azurobe": "Bushi",
    "Cryolinx": "Sibelyx",
    "Blazehowl": "Rayhound",
    "Blazehowl Noct": "Blazehowl",
    "Relaxaurus": "Penking",
    "Relaxaurus Lux": "Grintale",
    "Broncherry": "Chillet",
    "Broncherry Aqua": "Arsox",
    "Petallia": "Foxcicle",
    "Reptyro": "Elphidran",
    "Ice Reptyro": "Cinnamoth",
    "Kingpaca": "Incineram",
    "Ice Kingpaca": "Incineram",
    "Mammorest": "Penking",
    "Mammorest Cryst": "Penking",
    "Wumpo": "Incineram",
    "Wumpo Botan": "Incineram",
    "Warsect": "Elphidran",
    "Fenglope": "Broncherry",
    "Felbat": "Reindrix",
    "Quivern": "Elphidran",
    "Blazamut": "Ragnahawk",
    "Helzephyr": "Kingpaca",
    "Astegon": "Sibelyx",
    "Menasting": "Azurobe",
    "Anubis": "Vanwyrm",
    "Jormuntide": "Elphidran",
    "Jormuntide Ignis": "Elphidran",
    "Suzaku": "Sweepa",
    "Suzaku Aqua": "Ragnahawk",
    "Grizzbolt": "Wumpo Botan",
    "Lyleen": "Azurobe",
    "Lyleen Noct": "Wumpo Botan",
    "Faleris": "Surfent",
    "Orserk": "Sibelyx",
    "Shadowbeak": "Sweepa",
    "Paladius": "Nitewing",
    "Necromus": "Sweepa",
    "Frostallion": "Mossanda",
    "Frostallion Noct": "Nitewing",
    "Jetragon": "Nitewing"
  },
  "Lovander": {
    "Lamball": "Dazzi",
    "Cattiva": "Dazzi",
    "Chikipi": "Fuddler",
    "Lifmunk": "Woolipop",
    "Foxparks": "Wixen",
    "Fuack": "Rushoar",
    "Sparkit": "Nox",
    "Tanzee": "Gobfin",
    "Rooby": "Vaelet",
    "Pengullet": "Maraith",
    "Penking": "Rayhound",
    "Jolthog": "Rooby",
    "Jolthog Cryst": "Maraith",
    "Gumoss": "Gobfin",
    "Gumoss (Special)": "Gobfin",
    "Vixy": "Woolipop",
    "Hoocrates": "Wixen",
    "Teafant": "Dazzi",
    "Depresso": "Wixen",
    "Cremis": "Woolipop",
    "Daedream": "Gobfin",
    "Rushoar": "Galeclaw",
    "Nox": "Direhowl",
    "Fuddler": "Cawgnito",
    "Killamari": "Lunaris",
    "Mau": "Dazzi",
    "Mau Cryst": "Woolipop",
    "Celaray": "Mozzarina",
    "Direhowl": "Felbat",
    "Tocotoco": "Rushoar",
    "Flopie": "Lunaris",
    "Mozzarina": "Eikthyrdeer",
    "Bristla": "Rushoar",
    "Gobfin": "Robinquill",
    "Gobfin Ignis": "Robinquill",
    "Hangyu": "Nox",
    "Hangyu Cryst": "Nox",
    "Mossanda": "Univolt",
    "Mossanda Lux": "Vanwyrm",
    "Woolipop": "Direhowl",
    "Caprity": "Caprity",
    "Melpaca": "Eikthyrdeer",
    "Eikthyrdeer": "Caprity",
    "Eikthyrdeer Terra": "Eikthyrdeer",
    "Nitewing": "Univolt",
    "Ribunny": "Rushoar",
    "Incineram": "Foxcicle",
    "Incineram Noct": "Foxcicle",
    "Cinnamoth": "Blazehowl",
    "Arsox": "Broncherry",
    "Dumud": "Eikthyrdeer",
    "Cawgnito": "Felbat",
    "Leezpunk": "Galeclaw",
    "Leezpunk Ignis": "Gorirat",
    "Loupmoon": "Loupmoon",
    "Galeclaw": "Fenglope",
    "Robinquill": "Fenglope",
    "Robinquill Terra": "Fenglope",
    "Gorirat": "Verdash",
    "Beegarde": "Felbat",
    "Elizabee": "Bushi",
    "Grintale": "Rayhound",
    "Swee": "Leezpunk",
    "Sweepa": "Univolt",
    "Chillet": "Celaray",
    "Univolt": "Dinossom",
    "Foxcicle": "Digtoise",
    "Pyrin": "Vanwyrm",
    "Pyrin Noct": "Incineram",
    "Reindrix": "Mozzarina",
    "Rayhound": "Digtoise",
    "Kitsun": "Melpaca",
    "Dazzi": "Cawgnito",
    "Lunaris": "Galeclaw",
    "Dinossom": "Reindrix",
    "Dinossom Lux": "Reindrix",
    "Surfent": "Tombat",
    "Surfent Terra": "Tombat",
    "Maraith": "Gorirat",
    "Digtoise": "Dumud",
    "Tombat": "Digtoise",
    "Lovander": "Lovander",
    "Flambelle": "Nox",
    "Vanwyrm": "Chillet",
    "Vanwyrm Cryst": "Petallia",
    "Bushi": "Arsox",
    "Beakon": "Anubis",
    "Ragnahawk": "Vanwyrm",
    "Katress": "Dinossom",
    "Wixen": "Vaelet",
    "Verdash": "Loupmoon",
    "Vaelet": "Verdash",
    "Sibelyx": "Katress",
    "Elphidran": "Rayhound",
    "Elphidran Aqua": "Rayhound",
    "Kelpsea": "Lunaris",
    "Kelpsea Ignis": "Lunaris",
    "Azurobe": "Blazehowl",
    "Cryolinx": "Elphidran",
    "Blazehowl": "Kitsun",
    "Blazehowl Noct": "Chillet",
    "Relaxaurus": "Incineram",
    "Relaxaurus Lux": "Incineram",
    "Broncherry": "Dumud",
    "Broncherry Aqua": "Melpaca",
    "Petallia": "Broncherry",
    "Reptyro": "Bushi",
    "Ice Reptyro": "Incineram",
    "Kingpaca": "Blazehowl",
    "Ice Kingpaca": "Univolt",
    "Mammorest": "Bushi",
    "Mammorest Cryst": "Incineram",
    "Wumpo": "Katress",
    "Wumpo Botan": "Blazehowl",
    "Warsect": "Bushi",
    "Fenglope": "Loupmoon",
    "Felbat": "Fenglope",
    "Quivern": "Bushi",
    "Blazamut": "Wumpo Botan",
    "Helzephyr": "Anubis",
    "Astegon": "Elphidran",
    "Menasting": "Incineram",
    "Anubis": "Tombat",
    "Jormuntide": "Bushi",
    "Jormuntide Ignis": "Bushi",
    "Suzaku": "Azurobe",
    "Suzaku Aqua": "Wumpo Botan",
    "Grizzbolt": "Anubis",
    "Lyleen": "Incineram",
    "Lyleen Noct": "Anubis",
    "Faleris": "Vanwyrm",
    "Orserk": "Elphidran",
    "Shadowbeak": "Azurobe",
    "Paladius": "Grintale",
    "Necromus": "Azurobe",
    "Frostallion": "Elphidran",
    "Frostallion Noct": "Penking",
    "Jetragon": "Penking"
  },
  "Flambelle": {
    "Lamball": "Lifmunk",
    "Cattiva": "Lifmunk",
    "Chikipi": "Cremis",
    "Lifmunk": "Hangyu",
    "Foxparks": "Flambelle",
    "Fuack": "Jolthog",
    "Sparkit": "Sparkit",
    "Tanzee": "Fuack",
    "Rooby": "Flopie",
    "Pengullet": "Depresso",
    "Penking": "Loupmoon",
    "Jolthog": "Hoocrates",
    "Jolthog Cryst": "Depresso",
    "Gumoss": "Bristla",
    "Gumoss (Special)": "Bristla",
    "Vixy": "Lifmunk",
    "Hoocrates": "Foxparks",
    "Teafant": "Vixy",
    "Depresso": "Hoocrates",
    "Cremis": "Lifmunk",
    "Daedream": "Bristla",
    "Rushoar": "Kelpsea Ignis",
    "Nox": "Killamari",
    "Fuddler": "Ribunny",
    "Killamari": "Pengullet",
    "Mau": "Vixy",
    "Mau Cryst": "Hangyu",
    "Celaray": "Rushoar",
    "Direhowl": "Daedream",
    "Tocotoco": "Jolthog",
    "Flopie": "Tocotoco",
    "Mozzarina": "Wixen",
    "Bristla": "Jolthog",
    "Gobfin": "Tanzee",
    "Gobfin Ignis": "Tanzee",
    "Hangyu": "Sparkit",
    "Hangyu Cryst": "Sparkit",
    "Mossanda": "Eikthyrdeer",
    "Mossanda Lux": "Dumud",
    "Woolipop": "Swee",
    "Caprity": "Wixen",
    "Melpaca": "Maraith",
    "Eikthyrdeer": "Wixen",
    "Eikthyrdeer Terra": "Rooby",
    "Nitewing": "Mozzarina",
    "Ribunny": "Pengullet",
    "Incineram": "Verdash",
    "Incineram Noct": "Verdash",
    "Cinnamoth": "Loupmoon",
    "Arsox": "Gobfin",
    "Dumud": "Maraith",
    "Cawgnito": "Gumoss",
    "Leezpunk": "Leezpunk Ignis",
    "Leezpunk Ignis": "Kelpsea Ignis",
    "Loupmoon": "Nox",
    "Galeclaw": "Fuddler",
    "Robinquill": "Dazzi",
    "Robinquill Terra": "Dazzi",
    "Gorirat": "Fuddler",
    "Beegarde": "Gumoss",
    "Elizabee": "Celaray",
    "Grintale": "Loupmoon",
    "Swee": "Pengullet",
    "Sweepa": "Mozzarina",
    "Chillet": "Lunaris",
    "Univolt": "Gorirat",
    "Foxcicle": "Cawgnito",
    "Pyrin": "Reindrix",
    "Pyrin Noct": "Dinossom",
    "Reindrix": "Maraith",
    "Rayhound": "Beegarde",
    "Kitsun": "Leezpunk",
    "Dazzi": "Ribunny",
    "Lunaris": "Kelpsea",
    "Dinossom": "Lunaris",
    "Dinossom Lux": "Lunaris",
    "Surfent": "Fenglope",
    "Surfent Terra": "Fenglope",
    "Maraith": "Flopie",
    "Digtoise": "Rushoar",
    "Tombat": "Cawgnito",
    "Lovander": "Nox",
    "Flambelle": "Flambelle",
    "Vanwyrm": "Galeclaw",
    "Vanwyrm Cryst": "Felbat",
    "Bushi": "Robinquill",
    "Beakon": "Dinossom",
    "Ragnahawk": "Dumud",
    "Katress": "Vaelet",
    "Wixen": "Flopie",
    "Verdash": "Woolipop",
    "Vaelet": "Daedream",
    "Sibelyx": "Caprity",
    "Elphidran": "Fenglope",
    "Elphidran Aqua": "Fenglope",
    "Kelpsea": "Fuack",
    "Kelpsea Ignis": "Tocotoco",
    "Azurobe": "Loupmoon",
    "Cryolinx": "Foxcicle",
    "Blazehowl": "Direhowl",
    "Blazehowl Noct": "Gorirat",
    "Relaxaurus": "Digtoise",
    "Relaxaurus Lux": "Kitsun",
    "Broncherry": "Rushoar",
    "Broncherry Aqua": "Leezpunk",
    "Petallia": "Gobfin",
    "Reptyro": "Broncherry",
    "Ice Reptyro": "Dinossom",
    "Kingpaca": "Lovander",
    "Ice Kingpaca": "Eikthyrdeer",
    "Mammorest": "Digtoise",
    "Mammorest Cryst": "Digtoise",
    "Wumpo": "Caprity",
    "Wumpo Botan": "Lovander",
    "Warsect": "Celaray",
    "Fenglope": "Woolipop",
    "Felbat": "Dazzi",
    "Quivern": "Reindrix",
    "Blazamut": "Blazehowl",
    "Helzephyr": "Chillet",
    "Astegon": "Petallia",
    "Menasting": "Kitsun",
    "Anubis": "Verdash",
    "Jormuntide": "Broncherry",
    "Jormuntide Ignis": "Broncherry",
    "Suzaku": "Rayhound",
    "Suzaku Aqua": "Blazehowl",
    "Grizzbolt": "Chillet",
    "Lyleen": "Kitsun",
    "Lyleen Noct": "Chillet",
    "Faleris": "Melpaca",
    "Orserk": "Petallia",
    "Shadowbeak": "Rayhound",
    "Paladius": "Rayhound",
    "Necromus": "Rayhound",
    "Frostallion": "Foxcicle",
    "Frostallion Noct": "Tombat",
    "Jetragon": "Tombat"
  },
  "Vanwyrm": {
    "Lamball": "Direhowl",
    "Cattiva": "Direhowl",
    "Chikipi": "Cawgnito",
    "Lifmunk": "Gorirat",
    "Foxparks": "Galeclaw",
    "Fuack": "Verdash",
    "Sparkit": "Galeclaw",
    "Tanzee": "Loupmoon",
    "Rooby": "Mozzarina",
    "Pengullet": "Felbat",
    "Penking": "Incineram",
    "Jolthog": "Robinquill",
    "Jolthog Cryst": "Felbat",
    "Gumoss": "Loupmoon",
    "Gumoss (Special)": "Loupmoon",
    "Vixy": "Direhowl",
    "Hoocrates": "Galeclaw",
    "Teafant": "Cawgnito",
    "Depresso": "Robinquill",
    "Cremis": "Direhowl",
    "Daedream": "Loupmoon",
    "Rushoar": "Dumud",
    "Nox": "Eikthyrdeer",
    "Fuddler": "Lovander",
    "Killamari": "Fenglope",
    "Mau": "Beegarde",
    "Mau Cryst": "Vaelet",
    "Celaray": "Foxcicle",
    "Direhowl": "Broncherry",
    "Tocotoco": "Felbat",
    "Flopie": "Fenglope",
    "Mozzarina": "Arsox",
    "Bristla": "Verdash",
    "Gobfin": "Reindrix",
    "Gobfin Ignis": "Reindrix",
    "Hangyu": "Gorirat",
    "Hangyu Cryst": "Gorirat",
    "Mossanda": "Elphidran",
    "Mossanda Lux": "Penking",
    "Woolipop": "Eikthyrdeer",
    "Caprity": "Arsox",
    "Melpaca": "Petallia",
    "Eikthyrdeer": "Arsox",
    "Eikthyrdeer Terra": "Petallia",
    "Nitewing": "Elphidran",
    "Ribunny": "Fenglope",
    "Incineram": "Bushi",
    "Incineram Noct": "Bushi",
    "Cinnamoth": "Anubis",
    "Arsox": "Rayhound",
    "Dumud": "Petallia",
    "Cawgnito": "Celaray",
    "Leezpunk": "Melpaca",
    "Leezpunk Ignis": "Dumud",
    "Loupmoon": "Chillet",
    "Galeclaw": "Digtoise",
    "Robinquill": "Digtoise",
    "Robinquill Terra": "Kitsun",
    "Gorirat": "Digtoise",
    "Beegarde": "Broncherry",
    "Elizabee": "Azurobe",
    "Grintale": "Incineram",
    "Swee": "Fenglope",
    "Sweepa": "Elphidran",
    "Chillet": "Rayhound",
    "Univolt": "Univolt",
    "Foxcicle": "Vanwyrm Cryst",
    "Pyrin": "Grintale",
    "Pyrin Noct": "Sibelyx",
    "Reindrix": "Foxcicle",
    "Rayhound": "Katress",
    "Kitsun": "Tombat",
    "Dazzi": "Caprity",
    "Lunaris": "Melpaca",
    "Dinossom": "Rayhound",
    "Dinossom Lux": "Rayhound",
    "Surfent": "Incineram",
    "Surfent Terra": "Incineram",
    "Maraith": "Mozzarina",
    "Digtoise": "Tombat",
    "Tombat": "Blazehowl",
    "Lovander": "Chillet",
    "Flambelle": "Galeclaw",
    "Vanwyrm": "Vanwyrm",
    "Vanwyrm Cryst": "Bushi",
    "Bushi": "Vanwyrm",
    "Beakon": "Sibelyx",
    "Ragnahawk": "Penking",
    "Katress": "Univolt",
    "Wixen": "Mozzarina",
    "Verdash": "Kitsun",
    "Vaelet": "Digtoise",
    "Sibelyx": "Surfent",
    "Elphidran": "Incineram",
    "Elphidran Aqua": "Incineram",
    "Kelpsea": "Loupmoon",
    "Kelpsea Ignis": "Loupmoon",
    "Azurobe": "Anubis",
    "Cryolinx": "Sweepa",
    "Blazehowl": "Univolt",
    "Blazehowl Noct": "Vanwyrm",
    "Relaxaurus": "Kingpaca",
    "Relaxaurus Lux": "Wumpo",
    "Broncherry": "Foxcicle",
    "Broncherry Aqua": "Tombat",
    "Petallia": "Blazehowl",
    "Reptyro": "Cinnamoth",
    "Ice Reptyro": "Sibelyx",
    "Kingpaca": "Anubis",
    "Ice Kingpaca": "Elphidran",
    "Mammorest": "Wumpo Botan",
    "Mammorest Cryst": "Wumpo Botan",
    "Wumpo": "Surfent",
    "Wumpo Botan": "Anubis",
    "Warsect": "Azurobe",
    "Fenglope": "Dinossom",
    "Felbat": "Kitsun",
    "Quivern": "Azurobe",
    "Blazamut": "Elizabee",
    "Helzephyr": "Nitewing",
    "Astegon": "Sweepa",
    "Menasting": "Wumpo",
    "Anubis": "Faleris",
    "Jormuntide": "Wumpo Botan",
    "Jormuntide Ignis": "Cinnamoth",
    "Suzaku": "Pyrin",
    "Suzaku Aqua": "Warsect",
    "Grizzbolt": "Mossanda",
    "Lyleen": "Sibelyx",
    "Lyleen Noct": "Mossanda",
    "Faleris": "Penking",
    "Orserk": "Sweepa",
    "Shadowbeak": "Pyrin",
    "Paladius": "Pyrin",
    "Necromus": "Pyrin",
    "Frostallion": "Ragnahawk",
    "Frostallion Noct": "Ragnahawk",
    "Jetragon": "Ragnahawk"
  },
  "Vanwyrm Cryst": {
    "variant": true,
    "Lamball": "Gorirat",
    "Cattiva": "Gorirat",
    "Chikipi": "Direhowl",
    "Lifmunk": "Galeclaw",
    "Foxparks": "Felbat",
    "Fuack": "Fenglope",
    "Sparkit": "Robinquill",
    "Tanzee": "Caprity",
    "Rooby": "Melpaca",
    "Pengullet": "Fenglope",
    "Penking": "Anubis",
    "Jolthog": "Verdash",
    "Jolthog Cryst": "Verdash",
    "Gumoss": "Caprity",
    "Gumoss (Special)": "Caprity",
    "Vixy": "Galeclaw",
    "Hoocrates": "Felbat",
    "Teafant": "Direhowl",
    "Depresso": "Felbat",
    "Cremis": "Gorirat",
    "Daedream": "Eikthyrdeer",
    "Rushoar": "Reindrix",
    "Nox": "Dumud",
    "Fuddler": "Eikthyrdeer",
    "Killamari": "Loupmoon",
    "Mau": "Vaelet",
    "Mau Cryst": "Galeclaw",
    "Celaray": "Tombat",
    "Direhowl": "Digtoise",
    "Tocotoco": "Fenglope",
    "Flopie": "Loupmoon",
    "Mozzarina": "Foxcicle",
    "Bristla": "Fenglope",
    "Gobfin": "Digtoise",
    "Gobfin Ignis": "Broncherry",
    "Hangyu": "Robinquill",
    "Hangyu Cryst": "Robinquill",
    "Mossanda": "Penking",
    "Mossanda Lux": "Azurobe",
    "Woolipop": "Mozzarina",
    "Caprity": "Petallia",
    "Melpaca": "Tombat",
    "Eikthyrdeer": "Foxcicle",
    "Eikthyrdeer Terra": "Foxcicle",
    "Nitewing": "Penking",
    "Ribunny": "Loupmoon",
    "Incineram": "Incineram",
    "Incineram Noct": "Incineram",
    "Cinnamoth": "Surfent",
    "Arsox": "Blazehowl",
    "Dumud": "Foxcicle",
    "Cawgnito": "Digtoise",
    "Leezpunk": "Celaray",
    "Leezpunk Ignis": "Reindrix",
    "Loupmoon": "Arsox",
    "Galeclaw": "Kitsun",
    "Robinquill": "Dinossom",
    "Robinquill Terra": "Dinossom",
    "Gorirat": "Kitsun",
    "Beegarde": "Digtoise",
    "Elizabee": "Wumpo Botan",
    "Grintale": "Anubis",
    "Swee": "Loupmoon",
    "Sweepa": "Penking",
    "Chillet": "Blazehowl",
    "Univolt": "Vanwyrm",
    "Foxcicle": "Univolt",
    "Pyrin": "Cinnamoth",
    "Pyrin Noct": "Mossanda",
    "Reindrix": "Tombat",
    "Rayhound": "Univolt",
    "Kitsun": "Rayhound",
    "Dazzi": "Eikthyrdeer",
    "Lunaris": "Broncherry",
    "Dinossom": "Blazehowl",
    "Dinossom Lux": "Blazehowl",
    "Surfent": "Incineram",
    "Surfent Terra": "Incineram",
    "Maraith": "Melpaca",
    "Digtoise": "Rayhound",
    "Tombat": "Univolt",
    "Lovander": "Petallia",
    "Flambelle": "Felbat",
    "Vanwyrm": "Bushi",
    "Vanwyrm Cryst": "Vanwyrm Cryst",
    "Bushi": "Bushi",
    "Beakon": "Nitewing",
    "Ragnahawk": "Azurobe",
    "Katress": "Vanwyrm",
    "Wixen": "Melpaca",
    "Verdash": "Chillet",
    "Vaelet": "Kitsun",
    "Sibelyx": "Elphidran",
    "Elphidran": "Anubis",
    "Elphidran Aqua": "Anubis",
    "Kelpsea": "Lovander",
    "Kelpsea Ignis": "Loupmoon",
    "Azurobe": "Surfent",
    "Cryolinx": "Ragnahawk",
    "Blazehowl": "Vanwyrm",
    "Blazehowl Noct": "Bushi",
    "Relaxaurus": "Sibelyx",
    "Relaxaurus Lux": "Sibelyx",
    "Broncherry": "Rayhound",
    "Broncherry Aqua": "Rayhound",
    "Petallia": "Katress",
    "Reptyro": "Kingpaca",
    "Ice Reptyro": "Nitewing",
    "Kingpaca": "Elphidran",
    "Ice Kingpaca": "Elphidran",
    "Mammorest": "Wumpo",
    "Mammorest Cryst": "Sibelyx",
    "Wumpo": "Elphidran",
    "Wumpo Botan": "Elphidran",
    "Warsect": "Wumpo Botan",
    "Fenglope": "Chillet",
    "Felbat": "Dinossom",
    "Quivern": "Wumpo Botan",
    "Blazamut": "Jormuntide",
    "Helzephyr": "Sweepa",
    "Astegon": "Ragnahawk",
    "Menasting": "Sibelyx",
    "Anubis": "Incineram",
    "Jormuntide": "Wumpo",
    "Jormuntide Ignis": "Kingpaca",
    "Suzaku": "Elizabee",
    "Suzaku Aqua": "Reptyro",
    "Grizzbolt": "Sweepa",
    "Lyleen": "Mossanda",
    "Lyleen Noct": "Nitewing",
    "Faleris": "Azurobe",
    "Orserk": "Ragnahawk",
    "Shadowbeak": "Warsect",
    "Paladius": "Quivern",
    "Necromus": "Warsect",
    "Frostallion": "Pyrin",
    "Frostallion Noct": "Pyrin",
    "Jetragon": "Pyrin"
  },
  "Bushi": {
    "Lamball": "Direhowl",
    "Cattiva": "Vaelet",
    "Chikipi": "Beegarde",
    "Lifmunk": "Galeclaw",
    "Foxparks": "Robinquill",
    "Fuack": "Fenglope",
    "Sparkit": "Galeclaw",
    "Tanzee": "Loupmoon",
    "Rooby": "Dumud",
    "Pengullet": "Verdash",
    "Penking": "Anubis",
    "Jolthog": "Felbat",
    "Jolthog Cryst": "Felbat",
    "Gumoss": "Lovander",
    "Gumoss (Special)": "Lovander",
    "Vixy": "Gorirat",
    "Hoocrates": "Robinquill",
    "Teafant": "Direhowl",
    "Depresso": "Felbat",
    "Cremis": "Vaelet",
    "Daedream": "Caprity",
    "Rushoar": "Melpaca",
    "Nox": "Mozzarina",
    "Fuddler": "Caprity",
    "Killamari": "Loupmoon",
    "Mau": "Direhowl",
    "Mau Cryst": "Gorirat",
    "Celaray": "Tombat",
    "Direhowl": "Digtoise",
    "Tocotoco": "Verdash",
    "Flopie": "Loupmoon",
    "Mozzarina": "Petallia",
    "Bristla": "Fenglope",
    "Gobfin": "Broncherry",
    "Gobfin Ignis": "Celaray",
    "Hangyu": "Galeclaw",
    "Hangyu Cryst": "Galeclaw",
    "Mossanda": "Elphidran",
    "Mossanda Lux": "Penking",
    "Woolipop": "Eikthyrdeer",
    "Caprity": "Arsox",
    "Melpaca": "Foxcicle",
    "Eikthyrdeer": "Petallia",
    "Eikthyrdeer Terra": "Foxcicle",
    "Nitewing": "Elphidran",
    "Ribunny": "Fenglope",
    "Incineram": "Incineram",
    "Incineram Noct": "Incineram",
    "Cinnamoth": "Anubis",
    "Arsox": "Blazehowl",
    "Dumud": "Foxcicle",
    "Cawgnito": "Broncherry",
    "Leezpunk": "Reindrix",
    "Leezpunk Ignis": "Melpaca",
    "Loupmoon": "Arsox",
    "Galeclaw": "Kitsun",
    "Robinquill": "Kitsun",
    "Robinquill Terra": "Dinossom",
    "Gorirat": "Digtoise",
    "Beegarde": "Digtoise",
    "Elizabee": "Wumpo Botan",
    "Grintale": "Anubis",
    "Swee": "Fenglope",
    "Sweepa": "Penking",
    "Chillet": "Blazehowl",
    "Univolt": "Vanwyrm",
    "Foxcicle": "Katress",
    "Pyrin": "Azurobe",
    "Pyrin Noct": "Sibelyx",
    "Reindrix": "Foxcicle",
    "Rayhound": "Univolt",
    "Kitsun": "Rayhound",
    "Dazzi": "Eikthyrdeer",
    "Lunaris": "Reindrix",
    "Dinossom": "Rayhound",
    "Dinossom Lux": "Rayhound",
    "Surfent": "Incineram",
    "Surfent Terra": "Incineram",
    "Maraith": "Dumud",
    "Digtoise": "Tombat",
    "Tombat": "Katress",
    "Lovander": "Arsox",
    "Flambelle": "Robinquill",
    "Vanwyrm": "Vanwyrm",
    "Vanwyrm Cryst": "Bushi",
    "Bushi": "Bushi",
    "Beakon": "Mossanda",
    "Ragnahawk": "Grintale",
    "Katress": "Univolt",
    "Wixen": "Dumud",
    "Verdash": "Dinossom",
    "Vaelet": "Digtoise",
    "Sibelyx": "Elphidran",
    "Elphidran": "Incineram",
    "Elphidran Aqua": "Incineram",
    "Kelpsea": "Loupmoon",
    "Kelpsea Ignis": "Loupmoon",
    "Azurobe": "Anubis",
    "Cryolinx": "Ragnahawk",
    "Blazehowl": "Univolt",
    "Blazehowl Noct": "Vanwyrm",
    "Relaxaurus": "Wumpo",
    "Relaxaurus Lux": "Sibelyx",
    "Broncherry": "Tombat",
    "Broncherry Aqua": "Rayhound",
    "Petallia": "Blazehowl",
    "Reptyro": "Wumpo Botan",
    "Ice Reptyro": "Mossanda",
    "Kingpaca": "Surfent",
    "Ice Kingpaca": "Elphidran",
    "Mammorest": "Kingpaca",
    "Mammorest Cryst": "Wumpo",
    "Wumpo": "Elphidran",
    "Wumpo Botan": "Surfent",
    "Warsect": "Cinnamoth",
    "Fenglope": "Dinossom",
    "Felbat": "Kitsun",
    "Quivern": "Azurobe",
    "Blazamut": "Reptyro",
    "Helzephyr": "Nitewing",
    "Astegon": "Sweepa",
    "Menasting": "Sibelyx",
    "Anubis": "Incineram",
    "Jormuntide": "Wumpo Botan",
    "Jormuntide Ignis": "Wumpo Botan",
    "Suzaku": "Warsect",
    "Suzaku Aqua": "Elizabee",
    "Grizzbolt": "Nitewing",
    "Lyleen": "Sibelyx",
    "Lyleen Noct": "Nitewing",
    "Faleris": "Azurobe",
    "Orserk": "Ragnahawk",
    "Shadowbeak": "Quivern",
    "Paladius": "Pyrin",
    "Necromus": "Pyrin",
    "Frostallion": "Ragnahawk",
    "Frostallion Noct": "Pyrin",
    "Jetragon": "Pyrin"
  },
  "Beakon": {
    "Lamball": "Digtoise",
    "Cattiva": "Digtoise",
    "Chikipi": "Broncherry",
    "Lifmunk": "Kitsun",
    "Foxparks": "Dinossom",
    "Fuack": "Petallia",
    "Sparkit": "Dinossom",
    "Tanzee": "Rayhound",
    "Rooby": "Univolt",
    "Pengullet": "Arsox",
    "Penking": "Pyrin",
    "Jolthog": "Arsox",
    "Jolthog Cryst": "Arsox",
    "Gumoss": "Rayhound",
    "Gumoss (Special)": "Rayhound",
    "Vixy": "Kitsun",
    "Hoocrates": "Chillet",
    "Teafant": "Digtoise",
    "Depresso": "Chillet",
    "Cremis": "Kitsun",
    "Daedream": "Rayhound",
    "Rushoar": "Univolt",
    "Nox": "Katress",
    "Fuddler": "Blazehowl",
    "Killamari": "Tombat",
    "Mau": "Digtoise",
    "Mau Cryst": "Kitsun",
    "Celaray": "Elphidran",
    "Direhowl": "Bushi",
    "Tocotoco": "Petallia",
    "Flopie": "Tombat",
    "Mozzarina": "Anubis",
    "Bristla": "Foxcicle",
    "Gobfin": "Vanwyrm",
    "Gobfin Ignis": "Vanwyrm",
    "Hangyu": "Dinossom",
    "Hangyu Cryst": "Dinossom",
    "Mossanda": "Reptyro",
    "Mossanda Lux": "Jormuntide",
    "Woolipop": "Blazehowl",
    "Caprity": "Anubis",
    "Melpaca": "Surfent",
    "Eikthyrdeer": "Anubis",
    "Eikthyrdeer Terra": "Surfent",
    "Nitewing": "Reptyro",
    "Ribunny": "Foxcicle",
    "Incineram": "Sweepa",
    "Incineram Noct": "Sweepa",
    "Cinnamoth": "Pyrin",
    "Arsox": "Azurobe",
    "Dumud": "Surfent",
    "Cawgnito": "Vanwyrm",
    "Leezpunk": "Univolt",
    "Leezpunk Ignis": "Univolt",
    "Loupmoon": "Incineram",
    "Galeclaw": "Bushi",
    "Robinquill": "Bushi",
    "Robinquill Terra": "Incineram",
    "Gorirat": "Bushi",
    "Beegarde": "Bushi",
    "Elizabee": "Relaxaurus",
    "Grintale": "Pyrin",
    "Swee": "Foxcicle",
    "Sweepa": "Jormuntide",
    "Chillet": "Grintale",
    "Univolt": "Sibelyx",
    "Foxcicle": "Cinnamoth",
    "Pyrin": "Relaxaurus",
    "Pyrin Noct": "Beakon",
    "Reindrix": "Elphidran",
    "Rayhound": "Wumpo Botan",
    "Kitsun": "Penking",
    "Dazzi": "Blazehowl",
    "Lunaris": "Vanwyrm",
    "Dinossom": "Penking",
    "Dinossom Lux": "Penking",
    "Surfent": "Ragnahawk",
    "Surfent Terra": "Ragnahawk",
    "Maraith": "Univolt",
    "Digtoise": "Elphidran",
    "Tombat": "Wumpo Botan",
    "Lovander": "Anubis",
    "Flambelle": "Dinossom",
    "Vanwyrm": "Sibelyx",
    "Vanwyrm Cryst": "Nitewing",
    "Bushi": "Mossanda",
    "Beakon": "Beakon",
    "Ragnahawk": "Mammorest",
    "Katress": "Wumpo",
    "Wixen": "Univolt",
    "Verdash": "Incineram",
    "Vaelet": "Bushi",
    "Sibelyx": "Elizabee",
    "Elphidran": "Ragnahawk",
    "Elphidran Aqua": "Ragnahawk",
    "Kelpsea": "Rayhound",
    "Kelpsea Ignis": "Tombat",
    "Azurobe": "Pyrin",
    "Cryolinx": "Helzephyr",
    "Blazehowl": "Wumpo",
    "Blazehowl Noct": "Sibelyx",
    "Relaxaurus": "Menasting",
    "Relaxaurus Lux": "Menasting",
    "Broncherry": "Elphidran",
    "Broncherry Aqua": "Elphidran",
    "Petallia": "Azurobe",
    "Reptyro": "Relaxaurus",
    "Ice Reptyro": "Beakon",
    "Kingpaca": "Warsect",
    "Ice Kingpaca": "Elizabee",
    "Mammorest": "Menasting",
    "Mammorest Cryst": "Menasting",
    "Wumpo": "Warsect",
    "Wumpo Botan": "Quivern",
    "Warsect": "Relaxaurus",
    "Fenglope": "Incineram",
    "Felbat": "Incineram",
    "Quivern": "Relaxaurus",
    "Blazamut": "Cryolinx",
    "Helzephyr": "Beakon",
    "Astegon": "Helzephyr",
    "Menasting": "Beakon",
    "Anubis": "Sweepa",
    "Jormuntide": "Menasting",
    "Jormuntide Ignis": "Menasting",
    "Suzaku": "Cryolinx",
    "Suzaku Aqua": "Cryolinx",
    "Grizzbolt": "Beakon",
    "Lyleen": "Beakon",
    "Lyleen Noct": "Beakon",
    "Faleris": "Mammorest",
    "Orserk": "Helzephyr",
    "Shadowbeak": "Cryolinx",
    "Paladius": "Astegon",
    "Necromus": "Astegon",
    "Frostallion": "Astegon",
    "Frostallion Noct": "Astegon",
    "Jetragon": "Astegon"
  },
  "Ragnahawk": {
    "Lamball": "Eikthyrdeer",
    "Cattiva": "Eikthyrdeer",
    "Chikipi": "Lovander",
    "Lifmunk": "Mozzarina",
    "Foxparks": "Melpaca",
    "Fuack": "Digtoise",
    "Sparkit": "Dumud",
    "Tanzee": "Dinossom",
    "Rooby": "Foxcicle",
    "Pengullet": "Broncherry",
    "Penking": "Sibelyx",
    "Jolthog": "Reindrix",
    "Jolthog Cryst": "Celaray",
    "Gumoss": "Dinossom",
    "Gumoss (Special)": "Dinossom",
    "Vixy": "Eikthyrdeer",
    "Hoocrates": "Melpaca",
    "Teafant": "Caprity",
    "Depresso": "Reindrix",
    "Cremis": "Eikthyrdeer",
    "Daedream": "Chillet",
    "Rushoar": "Tombat",
    "Nox": "Petallia",
    "Fuddler": "Chillet",
    "Killamari": "Kitsun",
    "Mau": "Caprity",
    "Mau Cryst": "Mozzarina",
    "Celaray": "Bushi",
    "Direhowl": "Blazehowl",
    "Tocotoco": "Broncherry",
    "Flopie": "Kitsun",
    "Mozzarina": "Bushi",
    "Bristla": "Digtoise",
    "Gobfin": "Rayhound",
    "Gobfin Ignis": "Rayhound",
    "Hangyu": "Dumud",
    "Hangyu Cryst": "Dumud",
    "Mossanda": "Sweepa",
    "Mossanda Lux": "Ragnahawk",
    "Woolipop": "Arsox",
    "Caprity": "Vanwyrm",
    "Melpaca": "Bushi",
    "Eikthyrdeer": "Vanwyrm",
    "Eikthyrdeer Terra": "Bushi",
    "Nitewing": "Sweepa",
    "Ribunny": "Digtoise",
    "Incineram": "Wumpo Botan",
    "Incineram Noct": "Wumpo Botan",
    "Cinnamoth": "Mossanda",
    "Arsox": "Incineram",
    "Dumud": "Bushi",
    "Cawgnito": "Rayhound",
    "Leezpunk": "Tombat",
    "Leezpunk Ignis": "Foxcicle",
    "Loupmoon": "Vanwyrm",
    "Galeclaw": "Blazehowl",
    "Robinquill": "Katress",
    "Robinquill Terra": "Univolt",
    "Gorirat": "Blazehowl",
    "Beegarde": "Rayhound",
    "Elizabee": "Pyrin",
    "Grintale": "Sibelyx",
    "Swee": "Digtoise",
    "Sweepa": "Sweepa",
    "Chillet": "Incineram",
    "Univolt": "Elphidran",
    "Foxcicle": "Anubis",
    "Pyrin": "Pyrin",
    "Pyrin Noct": "Jormuntide",
    "Reindrix": "Bushi",
    "Rayhound": "Surfent",
    "Kitsun": "Incineram",
    "Dazzi": "Arsox",
    "Lunaris": "Tombat",
    "Dinossom": "Incineram",
    "Dinossom Lux": "Incineram",
    "Surfent": "Kingpaca",
    "Surfent Terra": "Wumpo",
    "Maraith": "Foxcicle",
    "Digtoise": "Incineram",
    "Tombat": "Anubis",
    "Lovander": "Vanwyrm",
    "Flambelle": "Dumud",
    "Vanwyrm": "Penking",
    "Vanwyrm Cryst": "Azurobe",
    "Bushi": "Grintale",
    "Beakon": "Mammorest",
    "Ragnahawk": "Ragnahawk",
    "Katress": "Elphidran",
    "Wixen": "Foxcicle",
    "Verdash": "Univolt",
    "Vaelet": "Blazehowl",
    "Sibelyx": "Nitewing",
    "Elphidran": "Wumpo",
    "Elphidran Aqua": "Sibelyx",
    "Kelpsea": "Dinossom",
    "Kelpsea Ignis": "Kitsun",
    "Azurobe": "Sibelyx",
    "Cryolinx": "Menasting",
    "Blazehowl": "Elphidran",
    "Blazehowl Noct": "Penking",
    "Relaxaurus": "Elizabee",
    "Relaxaurus Lux": "Reptyro",
    "Broncherry": "Bushi",
    "Broncherry Aqua": "Incineram",
    "Petallia": "Anubis",
    "Reptyro": "Quivern",
    "Ice Reptyro": "Jormuntide",
    "Kingpaca": "Nitewing",
    "Ice Kingpaca": "Sweepa",
    "Mammorest": "Warsect",
    "Mammorest Cryst": "Elizabee",
    "Wumpo": "Nitewing",
    "Wumpo Botan": "Mossanda",
    "Warsect": "Pyrin",
    "Fenglope": "Univolt",
    "Felbat": "Katress",
    "Quivern": "Pyrin",
    "Blazamut": "Helzephyr",
    "Helzephyr": "Relaxaurus",
    "Astegon": "Menasting",
    "Menasting": "Reptyro",
    "Anubis": "Wumpo Botan",
    "Jormuntide": "Warsect",
    "Jormuntide Ignis": "Quivern",
    "Suzaku": "Beakon",
    "Suzaku Aqua": "Beakon",
    "Grizzbolt": "Relaxaurus",
    "Lyleen": "Jormuntide",
    "Lyleen Noct": "Mammorest",
    "Faleris": "Ragnahawk",
    "Orserk": "Menasting",
    "Shadowbeak": "Beakon",
    "Paladius": "Beakon",
    "Necromus": "Beakon",
    "Frostallion": "Menasting",
    "Frostallion Noct": "Beakon",
    "Jetragon": "Beakon"
  },
  "Katress": {
    "Lamball": "Gobfin",
    "Cattiva": "Cawgnito",
    "Chikipi": "Lunaris",
    "Lifmunk": "Direhowl",
    "Foxparks": "Vaelet",
    "Fuack": "Robinquill",
    "Sparkit": "Direhowl",
    "Tanzee": "Fenglope",
    "Rooby": "Caprity",
    "Pengullet": "Galeclaw",
    "Penking": "Incineram",
    "Jolthog": "Galeclaw",
    "Jolthog Cryst": "Galeclaw",
    "Gumoss": "Fenglope",
    "Gumoss (Special)": "Fenglope",
    "Vixy": "Cawgnito",
    "Hoocrates": "Gorirat",
    "Teafant": "Gobfin",
    "Depresso": "Gorirat",
    "Cremis": "Cawgnito",
    "Daedream": "Loupmoon",
    "Rushoar": "Eikthyrdeer",
    "Nox": "Lovander",
    "Fuddler": "Loupmoon",
    "Killamari": "Verdash",
    "Mau": "Gobfin",
    "Mau Cryst": "Beegarde",
    "Celaray": "Arsox",
    "Direhowl": "Reindrix",
    "Tocotoco": "Robinquill",
    "Flopie": "Verdash",
    "Mozzarina": "Chillet",
    "Bristla": "Felbat",
    "Gobfin": "Dumud",
    "Gobfin Ignis": "Dumud",
    "Hangyu": "Direhowl",
    "Hangyu Cryst": "Direhowl",
    "Mossanda": "Anubis",
    "Mossanda Lux": "Elphidran",
    "Woolipop": "Loupmoon",
    "Caprity": "Dinossom",
    "Melpaca": "Arsox",
    "Eikthyrdeer": "Dinossom",
    "Eikthyrdeer Terra": "Chillet",
    "Nitewing": "Surfent",
    "Ribunny": "Felbat",
    "Incineram": "Bushi",
    "Incineram Noct": "Bushi",
    "Cinnamoth": "Incineram",
    "Arsox": "Tombat",
    "Dumud": "Chillet",
    "Cawgnito": "Melpaca",
    "Leezpunk": "Mozzarina",
    "Leezpunk Ignis": "Eikthyrdeer",
    "Loupmoon": "Kitsun",
    "Galeclaw": "Broncherry",
    "Robinquill": "Broncherry",
    "Robinquill Terra": "Digtoise",
    "Gorirat": "Celaray",
    "Beegarde": "Melpaca",
    "Elizabee": "Penking",
    "Grintale": "Incineram",
    "Swee": "Felbat",
    "Sweepa": "Surfent",
    "Chillet": "Tombat",
    "Univolt": "Univolt",
    "Foxcicle": "Rayhound",
    "Pyrin": "Pyrin Noct",
    "Pyrin Noct": "Kingpaca",
    "Reindrix": "Arsox",
    "Rayhound": "Blazehowl",
    "Kitsun": "Foxcicle",
    "Dazzi": "Loupmoon",
    "Lunaris": "Mozzarina",
    "Dinossom": "Foxcicle",
    "Dinossom Lux": "Tombat",
    "Surfent": "Bushi",
    "Surfent Terra": "Bushi",
    "Maraith": "Eikthyrdeer",
    "Digtoise": "Petallia",
    "Tombat": "Rayhound",
    "Lovander": "Dinossom",
    "Flambelle": "Vaelet",
    "Vanwyrm": "Univolt",
    "Vanwyrm Cryst": "Vanwyrm",
    "Bushi": "Univolt",
    "Beakon": "Wumpo",
    "Ragnahawk": "Elphidran",
    "Katress": "Katress",
    "Wixen": "Caprity",
    "Verdash": "Digtoise",
    "Vaelet": "Reindrix",
    "Sibelyx": "Anubis",
    "Elphidran": "Bushi",
    "Elphidran Aqua": "Incineram",
    "Kelpsea": "Fenglope",
    "Kelpsea Ignis": "Fenglope",
    "Azurobe": "Incineram",
    "Cryolinx": "Nitewing",
    "Blazehowl": "Blazehowl",
    "Blazehowl Noct": "Univolt",
    "Relaxaurus": "Cinnamoth",
    "Relaxaurus Lux": "Wumpo Botan",
    "Broncherry": "Petallia",
    "Broncherry Aqua": "Foxcicle",
    "Petallia": "Rayhound",
    "Reptyro": "Grintale",
    "Ice Reptyro": "Wumpo",
    "Kingpaca": "Incineram",
    "Ice Kingpaca": "Anubis",
    "Mammorest": "Azurobe",
    "Mammorest Cryst": "Azurobe",
    "Wumpo": "Anubis",
    "Wumpo Botan": "Incineram",
    "Warsect": "Penking",
    "Fenglope": "Digtoise",
    "Felbat": "Digtoise",
    "Quivern": "Penking",
    "Blazamut": "Pyrin",
    "Helzephyr": "Sibelyx",
    "Astegon": "Nitewing",
    "Menasting": "Wumpo Botan",
    "Anubis": "Bushi",
    "Jormuntide": "Azurobe",
    "Jormuntide Ignis": "Grintale",
    "Suzaku": "Ragnahawk",
    "Suzaku Aqua": "Pyrin",
    "Grizzbolt": "Sibelyx",
    "Lyleen": "Wumpo Botan",
    "Lyleen Noct": "Sibelyx",
    "Faleris": "Elphidran",
    "Orserk": "Nitewing",
    "Shadowbeak": "Ragnahawk",
    "Paladius": "Ragnahawk",
    "Necromus": "Ragnahawk",
    "Frostallion": "Sweepa",
    "Frostallion Noct": "Sweepa",
    "Jetragon": "Sweepa"
  },
  "Wixen": {
    "Lamball": "Bristla",
    "Cattiva": "Ribunny",
    "Chikipi": "Fuack",
    "Lifmunk": "Killamari",
    "Foxparks": "Flopie",
    "Fuack": "Tanzee",
    "Sparkit": "Killamari",
    "Tanzee": "Dazzi",
    "Rooby": "Wixen",
    "Pengullet": "Kelpsea",
    "Penking": "Digtoise",
    "Jolthog": "Kelpsea",
    "Jolthog Cryst": "Kelpsea",
    "Gumoss": "Dazzi",
    "Gumoss (Special)": "Dazzi",
    "Vixy": "Swee",
    "Hoocrates": "Kelpsea Ignis",
    "Teafant": "Bristla",
    "Depresso": "Kelpsea Ignis",
    "Cremis": "Ribunny",
    "Daedream": "Woolipop",
    "Rushoar": "Maraith",
    "Nox": "Wixen",
    "Fuddler": "Woolipop",
    "Killamari": "Fuddler",
    "Mau": "Bristla",
    "Mau Cryst": "Swee",
    "Celaray": "Robinquill",
    "Direhowl": "Lunaris",
    "Tocotoco": "Tanzee",
    "Flopie": "Fuddler",
    "Mozzarina": "Galeclaw",
    "Bristla": "Gumoss",
    "Gobfin": "Rushoar",
    "Gobfin Ignis": "Rushoar",
    "Hangyu": "Killamari",
    "Hangyu Cryst": "Killamari",
    "Mossanda": "Arsox",
    "Mossanda Lux": "Petallia",
    "Woolipop": "Nox",
    "Caprity": "Gorirat",
    "Melpaca": "Galeclaw",
    "Eikthyrdeer": "Gorirat",
    "Eikthyrdeer Terra": "Galeclaw",
    "Nitewing": "Arsox",
    "Ribunny": "Daedream",
    "Incineram": "Reindrix",
    "Incineram Noct": "Celaray",
    "Cinnamoth": "Kitsun",
    "Arsox": "Fenglope",
    "Dumud": "Galeclaw",
    "Cawgnito": "Leezpunk",
    "Leezpunk": "Rushoar",
    "Leezpunk Ignis": "Maraith",
    "Loupmoon": "Direhowl",
    "Galeclaw": "Gobfin",
    "Robinquill": "Gobfin",
    "Robinquill Terra": "Cawgnito",
    "Gorirat": "Lunaris",
    "Beegarde": "Lunaris",
    "Elizabee": "Tombat",
    "Grintale": "Kitsun",
    "Swee": "Daedream",
    "Sweepa": "Arsox",
    "Chillet": "Fenglope",
    "Univolt": "Eikthyrdeer",
    "Foxcicle": "Loupmoon",
    "Pyrin": "Foxcicle",
    "Pyrin Noct": "Katress",
    "Reindrix": "Robinquill",
    "Rayhound": "Loupmoon",
    "Kitsun": "Verdash",
    "Dazzi": "Woolipop",
    "Lunaris": "Rushoar",
    "Dinossom": "Verdash",
    "Dinossom Lux": "Fenglope",
    "Surfent": "Broncherry",
    "Surfent Terra": "Digtoise",
    "Maraith": "Rooby",
    "Digtoise": "Felbat",
    "Tombat": "Loupmoon",
    "Lovander": "Vaelet",
    "Flambelle": "Flopie",
    "Vanwyrm": "Mozzarina",
    "Vanwyrm Cryst": "Melpaca",
    "Bushi": "Dumud",
    "Beakon": "Univolt",
    "Ragnahawk": "Foxcicle",
    "Katress": "Caprity",
    "Wixen": "Wixen",
    "Verdash": "Cawgnito",
    "Vaelet": "Lunaris",
    "Sibelyx": "Chillet",
    "Elphidran": "Digtoise",
    "Elphidran Aqua": "Digtoise",
    "Kelpsea": "Dazzi",
    "Kelpsea Ignis": "Dazzi",
    "Azurobe": "Kitsun",
    "Cryolinx": "Bushi",
    "Blazehowl": "Caprity",
    "Blazehowl Noct": "Eikthyrdeer",
    "Relaxaurus": "Blazehowl",
    "Relaxaurus Lux": "Blazehowl",
    "Broncherry": "Felbat",
    "Broncherry Aqua": "Felbat",
    "Petallia": "Fenglope",
    "Reptyro": "Rayhound",
    "Ice Reptyro": "Katress",
    "Kingpaca": "Dinossom",
    "Ice Kingpaca": "Chillet",
    "Mammorest": "Rayhound",
    "Mammorest Cryst": "Rayhound",
    "Wumpo": "Dinossom",
    "Wumpo Botan": "Dinossom",
    "Warsect": "Tombat",
    "Fenglope": "Beegarde",
    "Felbat": "Gobfin",
    "Quivern": "Tombat",
    "Blazamut": "Incineram",
    "Helzephyr": "Univolt",
    "Astegon": "Vanwyrm",
    "Menasting": "Blazehowl",
    "Anubis": "Broncherry",
    "Jormuntide": "Rayhound",
    "Jormuntide Ignis": "Rayhound",
    "Suzaku": "Incineram",
    "Suzaku Aqua": "Incineram",
    "Grizzbolt": "Univolt",
    "Lyleen": "Blazehowl",
    "Lyleen Noct": "Univolt",
    "Faleris": "Foxcicle",
    "Orserk": "Vanwyrm",
    "Shadowbeak": "Incineram",
    "Paladius": "Bushi",
    "Necromus": "Incineram",
    "Frostallion": "Bushi",
    "Frostallion Noct": "Bushi",
    "Jetragon": "Bushi"
  },
  "Verdash": {
    "Lamball": "Daedream",
    "Cattiva": "Fuddler",
    "Chikipi": "Tanzee",
    "Lifmunk": "Dazzi",
    "Foxparks": "Woolipop",
    "Fuack": "Wixen",
    "Sparkit": "Dazzi",
    "Tanzee": "Leezpunk",
    "Rooby": "Beegarde",
    "Pengullet": "Wixen",
    "Penking": "Tombat",
    "Jolthog": "Nox",
    "Jolthog Cryst": "Nox",
    "Gumoss": "Lunaris",
    "Gumoss (Special)": "Lunaris",
    "Vixy": "Fuddler",
    "Hoocrates": "Woolipop",
    "Teafant": "Gumoss",
    "Depresso": "Woolipop",
    "Cremis": "Fuddler",
    "Daedream": "Lunaris",
    "Rushoar": "Direhowl",
    "Nox": "Gobfin",
    "Fuddler": "Lunaris",
    "Killamari": "Rushoar",
    "Mau": "Daedream",
    "Mau Cryst": "Dazzi",
    "Celaray": "Caprity",
    "Direhowl": "Galeclaw",
    "Tocotoco": "Wixen",
    "Flopie": "Rushoar",
    "Mozzarina": "Loupmoon",
    "Bristla": "Rooby",
    "Gobfin": "Gorirat",
    "Gobfin Ignis": "Gorirat",
    "Hangyu": "Dazzi",
    "Hangyu Cryst": "Dazzi",
    "Mossanda": "Blazehowl",
    "Mossanda Lux": "Univolt",
    "Woolipop": "Gobfin",
    "Caprity": "Loupmoon",
    "Melpaca": "Lovander",
    "Eikthyrdeer": "Loupmoon",
    "Eikthyrdeer Terra": "Loupmoon",
    "Nitewing": "Blazehowl",
    "Ribunny": "Maraith",
    "Incineram": "Arsox",
    "Incineram Noct": "Arsox",
    "Cinnamoth": "Rayhound",
    "Arsox": "Melpaca",
    "Dumud": "Lovander",
    "Cawgnito": "Galeclaw",
    "Leezpunk": "Direhowl",
    "Leezpunk Ignis": "Direhowl",
    "Loupmoon": "Fenglope",
    "Galeclaw": "Felbat",
    "Robinquill": "Felbat",
    "Robinquill Terra": "Verdash",
    "Gorirat": "Robinquill",
    "Beegarde": "Galeclaw",
    "Elizabee": "Vanwyrm",
    "Grintale": "Tombat",
    "Swee": "Maraith",
    "Sweepa": "Katress",
    "Chillet": "Dumud",
    "Univolt": "Kitsun",
    "Foxcicle": "Reindrix",
    "Pyrin": "Univolt",
    "Pyrin Noct": "Incineram",
    "Reindrix": "Caprity",
    "Rayhound": "Broncherry",
    "Kitsun": "Mozzarina",
    "Dazzi": "Lunaris",
    "Lunaris": "Vaelet",
    "Dinossom": "Mozzarina",
    "Dinossom Lux": "Dumud",
    "Surfent": "Petallia",
    "Surfent Terra": "Foxcicle",
    "Maraith": "Beegarde",
    "Digtoise": "Eikthyrdeer",
    "Tombat": "Celaray",
    "Lovander": "Loupmoon",
    "Flambelle": "Woolipop",
    "Vanwyrm": "Kitsun",
    "Vanwyrm Cryst": "Chillet",
    "Bushi": "Dinossom",
    "Beakon": "Incineram",
    "Ragnahawk": "Univolt",
    "Katress": "Digtoise",
    "Wixen": "Cawgnito",
    "Verdash": "Verdash",
    "Vaelet": "Robinquill",
    "Sibelyx": "Blazehowl",
    "Elphidran": "Foxcicle",
    "Elphidran Aqua": "Foxcicle",
    "Kelpsea": "Rushoar",
    "Kelpsea Ignis": "Rushoar",
    "Azurobe": "Tombat",
    "Cryolinx": "Surfent",
    "Blazehowl": "Digtoise",
    "Blazehowl Noct": "Kitsun",
    "Relaxaurus": "Bushi",
    "Relaxaurus Lux": "Bushi",
    "Broncherry": "Eikthyrdeer",
    "Broncherry Aqua": "Eikthyrdeer",
    "Petallia": "Melpaca",
    "Reptyro": "Vanwyrm",
    "Ice Reptyro": "Incineram",
    "Kingpaca": "Rayhound",
    "Ice Kingpaca": "Blazehowl",
    "Mammorest": "Bushi",
    "Mammorest Cryst": "Bushi",
    "Wumpo": "Rayhound",
    "Wumpo Botan": "Rayhound",
    "Warsect": "Vanwyrm",
    "Fenglope": "Fenglope",
    "Felbat": "Felbat",
    "Quivern": "Univolt",
    "Blazamut": "Azurobe",
    "Helzephyr": "Incineram",
    "Astegon": "Anubis",
    "Menasting": "Bushi",
    "Anubis": "Petallia",
    "Jormuntide": "Vanwyrm",
    "Jormuntide Ignis": "Vanwyrm",
    "Suzaku": "Penking",
    "Suzaku Aqua": "Grintale",
    "Grizzbolt": "Incineram",
    "Lyleen": "Bushi",
    "Lyleen Noct": "Incineram",
    "Faleris": "Univolt",
    "Orserk": "Anubis",
    "Shadowbeak": "Penking",
    "Paladius": "Elphidran",
    "Necromus": "Elphidran",
    "Frostallion": "Surfent",
    "Frostallion Noct": "Elphidran",
    "Jetragon": "Elphidran"
  },
  "Vaelet": {
    "Lamball": "Kelpsea",
    "Cattiva": "Kelpsea",
    "Chikipi": "Kelpsea Ignis",
    "Lifmunk": "Gumoss",
    "Foxparks": "Fuddler",
    "Fuack": "Woolipop",
    "Sparkit": "Daedream",
    "Tanzee": "Maraith",
    "Rooby": "Lunaris",
    "Pengullet": "Dazzi",
    "Penking": "Arsox",
    "Jolthog": "Dazzi",
    "Jolthog Cryst": "Dazzi",
    "Gumoss": "Maraith",
    "Gumoss (Special)": "Maraith",
    "Vixy": "Tanzee",
    "Hoocrates": "Fuddler",
    "Teafant": "Kelpsea Ignis",
    "Depresso": "Dazzi",
    "Cremis": "Tanzee",
    "Daedream": "Rushoar",
    "Rushoar": "Gobfin",
    "Nox": "Lunaris",
    "Fuddler": "Rushoar",
    "Killamari": "Wixen",
    "Mau": "Kelpsea",
    "Mau Cryst": "Tanzee",
    "Celaray": "Loupmoon",
    "Direhowl": "Direhowl",
    "Tocotoco": "Woolipop",
    "Flopie": "Wixen",
    "Mozzarina": "Fenglope",
    "Bristla": "Woolipop",
    "Gobfin": "Beegarde",
    "Gobfin Ignis": "Cawgnito",
    "Hangyu": "Daedream",
    "Hangyu Cryst": "Gumoss",
    "Mossanda": "Rayhound",
    "Mossanda Lux": "Blazehowl",
    "Woolipop": "Leezpunk",
    "Caprity": "Verdash",
    "Melpaca": "Fenglope",
    "Eikthyrdeer": "Fenglope",
    "Eikthyrdeer Terra": "Fenglope",
    "Nitewing": "Rayhound",
    "Ribunny": "Nox",
    "Incineram": "Dinossom",
    "Incineram Noct": "Dinossom",
    "Cinnamoth": "Foxcicle",
    "Arsox": "Eikthyrdeer",
    "Dumud": "Fenglope",
    "Cawgnito": "Direhowl",
    "Leezpunk": "Gobfin",
    "Leezpunk Ignis": "Gobfin",
    "Loupmoon": "Felbat",
    "Galeclaw": "Gorirat",
    "Robinquill": "Galeclaw",
    "Robinquill Terra": "Galeclaw",
    "Gorirat": "Gorirat",
    "Beegarde": "Direhowl",
    "Elizabee": "Univolt",
    "Grintale": "Petallia",
    "Swee": "Nox",
    "Sweepa": "Rayhound",
    "Chillet": "Eikthyrdeer",
    "Univolt": "Broncherry",
    "Foxcicle": "Mozzarina",
    "Pyrin": "Blazehowl",
    "Pyrin Noct": "Bushi",
    "Reindrix": "Loupmoon",
    "Rayhound": "Dumud",
    "Kitsun": "Lovander",
    "Dazzi": "Rushoar",
    "Lunaris": "Cawgnito",
    "Dinossom": "Caprity",
    "Dinossom Lux": "Caprity",
    "Surfent": "Chillet",
    "Surfent Terra": "Chillet",
    "Maraith": "Lunaris",
    "Digtoise": "Loupmoon",
    "Tombat": "Dumud",
    "Lovander": "Verdash",
    "Flambelle": "Daedream",
    "Vanwyrm": "Digtoise",
    "Vanwyrm Cryst": "Kitsun",
    "Bushi": "Digtoise",
    "Beakon": "Bushi",
    "Ragnahawk": "Blazehowl",
    "Katress": "Reindrix",
    "Wixen": "Lunaris",
    "Verdash": "Robinquill",
    "Vaelet": "Vaelet",
    "Sibelyx": "Tombat",
    "Elphidran": "Arsox",
    "Elphidran Aqua": "Arsox",
    "Kelpsea": "Rooby",
    "Kelpsea Ignis": "Wixen",
    "Azurobe": "Petallia",
    "Cryolinx": "Incineram",
    "Blazehowl": "Reindrix",
    "Blazehowl Noct": "Broncherry",
    "Relaxaurus": "Vanwyrm",
    "Relaxaurus Lux": "Vanwyrm",
    "Broncherry": "Loupmoon",
    "Broncherry Aqua": "Loupmoon",
    "Petallia": "Eikthyrdeer",
    "Reptyro": "Univolt",
    "Ice Reptyro": "Bushi",
    "Kingpaca": "Foxcicle",
    "Ice Kingpaca": "Tombat",
    "Mammorest": "Univolt",
    "Mammorest Cryst": "Univolt",
    "Wumpo": "Tombat",
    "Wumpo Botan": "Foxcicle",
    "Warsect": "Katress",
    "Fenglope": "Robinquill",
    "Felbat": "Galeclaw",
    "Quivern": "Katress",
    "Blazamut": "Elphidran",
    "Helzephyr": "Bushi",
    "Astegon": "Incineram",
    "Menasting": "Vanwyrm",
    "Anubis": "Dinossom",
    "Jormuntide": "Univolt",
    "Jormuntide Ignis": "Univolt",
    "Suzaku": "Elphidran",
    "Suzaku Aqua": "Elphidran",
    "Grizzbolt": "Bushi",
    "Lyleen": "Vanwyrm",
    "Lyleen Noct": "Bushi",
    "Faleris": "Blazehowl",
    "Orserk": "Incineram",
    "Shadowbeak": "Surfent",
    "Paladius": "Anubis",
    "Necromus": "Surfent",
    "Frostallion": "Incineram",
    "Frostallion Noct": "Anubis",
    "Jetragon": "Anubis"
  },
  "Sibelyx": {
    "Lamball": "Loupmoon",
    "Cattiva": "Loupmoon",
    "Chikipi": "Fenglope",
    "Lifmunk": "Lovander",
    "Foxparks": "Eikthyrdeer",
    "Fuack": "Melpaca",
    "Sparkit": "Caprity",
    "Tanzee": "Digtoise",
    "Rooby": "Chillet",
    "Pengullet": "Dumud",
    "Penking": "Wumpo Botan",
    "Jolthog": "Mozzarina",
    "Jolthog Cryst": "Mozzarina",
    "Gumoss": "Digtoise",
    "Gumoss (Special)": "Digtoise",
    "Vixy": "Loupmoon",
    "Hoocrates": "Eikthyrdeer",
    "Teafant": "Fenglope",
    "Depresso": "Eikthyrdeer",
    "Cremis": "Loupmoon",
    "Daedream": "Digtoise",
    "Rushoar": "Arsox",
    "Nox": "Dinossom",
    "Fuddler": "Kitsun",
    "Killamari": "Celaray",
    "Mau": "Loupmoon",
    "Mau Cryst": "Loupmoon",
    "Celaray": "Vanwyrm",
    "Direhowl": "Tombat",
    "Tocotoco": "Dumud",
    "Flopie": "Broncherry",
    "Mozzarina": "Univolt",
    "Bristla": "Melpaca",
    "Gobfin": "Foxcicle",
    "Gobfin Ignis": "Petallia",
    "Hangyu": "Caprity",
    "Hangyu Cryst": "Lovander",
    "Mossanda": "Sibelyx",
    "Mossanda Lux": "Nitewing",
    "Woolipop": "Dinossom",
    "Caprity": "Univolt",
    "Melpaca": "Univolt",
    "Eikthyrdeer": "Univolt",
    "Eikthyrdeer Terra": "Univolt",
    "Nitewing": "Mossanda",
    "Ribunny": "Reindrix",
    "Incineram": "Penking",
    "Incineram Noct": "Penking",
    "Cinnamoth": "Kingpaca",
    "Arsox": "Bushi",
    "Dumud": "Univolt",
    "Cawgnito": "Foxcicle",
    "Leezpunk": "Arsox",
    "Leezpunk Ignis": "Arsox",
    "Loupmoon": "Katress",
    "Galeclaw": "Rayhound",
    "Robinquill": "Rayhound",
    "Robinquill Terra": "Rayhound",
    "Gorirat": "Tombat",
    "Beegarde": "Foxcicle",
    "Elizabee": "Ragnahawk",
    "Grintale": "Wumpo Botan",
    "Swee": "Reindrix",
    "Sweepa": "Mossanda",
    "Chillet": "Bushi",
    "Univolt": "Anubis",
    "Foxcicle": "Incineram",
    "Pyrin": "Sweepa",
    "Pyrin Noct": "Warsect",
    "Reindrix": "Vanwyrm",
    "Rayhound": "Incineram",
    "Kitsun": "Bushi",
    "Dazzi": "Kitsun",
    "Lunaris": "Petallia",
    "Dinossom": "Bushi",
    "Dinossom Lux": "Bushi",
    "Surfent": "Azurobe",
    "Surfent Terra": "Azurobe",
    "Maraith": "Chillet",
    "Digtoise": "Vanwyrm",
    "Tombat": "Incineram",
    "Lovander": "Katress",
    "Flambelle": "Caprity",
    "Vanwyrm": "Surfent",
    "Vanwyrm Cryst": "Elphidran",
    "Bushi": "Elphidran",
    "Beakon": "Elizabee",
    "Ragnahawk": "Nitewing",
    "Katress": "Anubis",
    "Wixen": "Chillet",
    "Verdash": "Blazehowl",
    "Vaelet": "Tombat",
    "Sibelyx": "Sibelyx",
    "Elphidran": "Azurobe",
    "Elphidran Aqua": "Cinnamoth",
    "Kelpsea": "Digtoise",
    "Kelpsea Ignis": "Broncherry",
    "Azurobe": "Wumpo Botan",
    "Cryolinx": "Relaxaurus",
    "Blazehowl": "Anubis",
    "Blazehowl Noct": "Surfent",
    "Relaxaurus": "Pyrin",
    "Relaxaurus Lux": "Pyrin",
    "Broncherry": "Vanwyrm",
    "Broncherry Aqua": "Bushi",
    "Petallia": "Incineram",
    "Reptyro": "Ragnahawk",
    "Ice Reptyro": "Warsect",
    "Kingpaca": "Wumpo",
    "Ice Kingpaca": "Sibelyx",
    "Mammorest": "Ragnahawk",
    "Mammorest Cryst": "Pyrin",
    "Wumpo": "Sibelyx",
    "Wumpo Botan": "Wumpo",
    "Warsect": "Sweepa",
    "Fenglope": "Blazehowl",
    "Felbat": "Rayhound",
    "Quivern": "Sweepa",
    "Blazamut": "Beakon",
    "Helzephyr": "Reptyro",
    "Astegon": "Mammorest",
    "Menasting": "Pyrin",
    "Anubis": "Grintale",
    "Jormuntide": "Ragnahawk",
    "Jormuntide Ignis": "Ragnahawk",
    "Suzaku": "Menasting",
    "Suzaku Aqua": "Beakon",
    "Grizzbolt": "Reptyro",
    "Lyleen": "Quivern",
    "Lyleen Noct": "Elizabee",
    "Faleris": "Sweepa",
    "Orserk": "Mammorest",
    "Shadowbeak": "Menasting",
    "Paladius": "Menasting",
    "Necromus": "Menasting",
    "Frostallion": "Relaxaurus",
    "Frostallion Noct": "Relaxaurus",
    "Jetragon": "Relaxaurus"
  },
  "Elphidran": {
    "Lamball": "Felbat",
    "Cattiva": "Felbat",
    "Chikipi": "Robinquill",
    "Lifmunk": "Fenglope",
    "Foxparks": "Fenglope",
    "Fuack": "Caprity",
    "Sparkit": "Fenglope",
    "Tanzee": "Dumud",
    "Rooby": "Digtoise",
    "Pengullet": "Loupmoon",
    "Penking": "Elphidran",
    "Jolthog": "Loupmoon",
    "Jolthog Cryst": "Loupmoon",
    "Gumoss": "Melpaca",
    "Gumoss (Special)": "Melpaca",
    "Vixy": "Verdash",
    "Hoocrates": "Loupmoon",
    "Teafant": "Robinquill",
    "Depresso": "Loupmoon",
    "Cremis": "Verdash",
    "Daedream": "Melpaca",
    "Rushoar": "Kitsun",
    "Nox": "Broncherry",
    "Fuddler": "Reindrix",
    "Killamari": "Eikthyrdeer",
    "Mau": "Felbat",
    "Mau Cryst": "Verdash",
    "Celaray": "Blazehowl",
    "Direhowl": "Chillet",
    "Tocotoco": "Lovander",
    "Flopie": "Mozzarina",
    "Mozzarina": "Rayhound",
    "Bristla": "Caprity",
    "Gobfin": "Dinossom",
    "Gobfin Ignis": "Dinossom",
    "Hangyu": "Fenglope",
    "Hangyu Cryst": "Fenglope",
    "Mossanda": "Wumpo Botan",
    "Mossanda Lux": "Wumpo",
    "Woolipop": "Broncherry",
    "Caprity": "Rayhound",
    "Melpaca": "Blazehowl",
    "Eikthyrdeer": "Rayhound",
    "Eikthyrdeer Terra": "Blazehowl",
    "Nitewing": "Wumpo Botan",
    "Ribunny": "Eikthyrdeer",
    "Incineram": "Anubis",
    "Incineram Noct": "Surfent",
    "Cinnamoth": "Penking",
    "Arsox": "Vanwyrm",
    "Dumud": "Blazehowl",
    "Cawgnito": "Dinossom",
    "Leezpunk": "Kitsun",
    "Leezpunk Ignis": "Digtoise",
    "Loupmoon": "Tombat",
    "Galeclaw": "Arsox",
    "Robinquill": "Petallia",
    "Robinquill Terra": "Foxcicle",
    "Gorirat": "Arsox",
    "Beegarde": "Chillet",
    "Elizabee": "Mossanda",
    "Grintale": "Penking",
    "Swee": "Eikthyrdeer",
    "Sweepa": "Wumpo Botan",
    "Chillet": "Univolt",
    "Univolt": "Incineram",
    "Foxcicle": "Vanwyrm",
    "Pyrin": "Sibelyx",
    "Pyrin Noct": "Ragnahawk",
    "Reindrix": "Blazehowl",
    "Rayhound": "Bushi",
    "Kitsun": "Univolt",
    "Dazzi": "Reindrix",
    "Lunaris": "Kitsun",
    "Dinossom": "Univolt",
    "Dinossom Lux": "Univolt",
    "Surfent": "Elphidran Aqua",
    "Surfent Terra": "Elphidran",
    "Maraith": "Digtoise",
    "Digtoise": "Katress",
    "Tombat": "Bushi",
    "Lovander": "Rayhound",
    "Flambelle": "Fenglope",
    "Vanwyrm": "Incineram",
    "Vanwyrm Cryst": "Anubis",
    "Bushi": "Incineram",
    "Beakon": "Ragnahawk",
    "Ragnahawk": "Wumpo",
    "Katress": "Bushi",
    "Wixen": "Digtoise",
    "Verdash": "Foxcicle",
    "Vaelet": "Arsox",
    "Sibelyx": "Azurobe",
    "Elphidran": "Elphidran",
    "Elphidran Aqua": "Elphidran",
    "Kelpsea": "Dumud",
    "Kelpsea Ignis": "Mozzarina",
    "Azurobe": "Penking",
    "Cryolinx": "Elizabee",
    "Blazehowl": "Bushi",
    "Blazehowl Noct": "Incineram",
    "Relaxaurus": "Sweepa",
    "Relaxaurus Lux": "Sweepa",
    "Broncherry": "Katress",
    "Broncherry Aqua": "Univolt",
    "Petallia": "Vanwyrm",
    "Reptyro": "Mossanda",
    "Ice Reptyro": "Ragnahawk",
    "Kingpaca": "Azurobe",
    "Ice Kingpaca": "Cinnamoth",
    "Mammorest": "Nitewing",
    "Mammorest Cryst": "Nitewing",
    "Wumpo": "Azurobe",
    "Wumpo Botan": "Grintale",
    "Warsect": "Sibelyx",
    "Fenglope": "Foxcicle",
    "Felbat": "Petallia",
    "Quivern": "Sibelyx",
    "Blazamut": "Relaxaurus",
    "Helzephyr": "Pyrin",
    "Astegon": "Warsect",
    "Menasting": "Sweepa",
    "Anubis": "Surfent",
    "Jormuntide": "Nitewing",
    "Jormuntide Ignis": "Mossanda",
    "Suzaku": "Mammorest",
    "Suzaku Aqua": "Relaxaurus",
    "Grizzbolt": "Pyrin",
    "Lyleen": "Sweepa",
    "Lyleen Noct": "Ragnahawk",
    "Faleris": "Sibelyx",
    "Orserk": "Warsect",
    "Shadowbeak": "Mammorest",
    "Paladius": "Jormuntide",
    "Necromus": "Jormuntide",
    "Frostallion": "Elizabee",
    "Frostallion Noct": "Reptyro",
    "Jetragon": "Jormuntide"
  },
  "Elphidran Aqua": {
    "variant": true,
    "Lamball": "Felbat",
    "Cattiva": "Verdash",
    "Chikipi": "Robinquill",
    "Lifmunk": "Fenglope",
    "Foxparks": "Loupmoon",
    "Fuack": "Caprity",
    "Sparkit": "Fenglope",
    "Tanzee": "Melpaca",
    "Rooby": "Digtoise",
    "Pengullet": "Lovander",
    "Penking": "Penking",
    "Jolthog": "Loupmoon",
    "Jolthog Cryst": "Loupmoon",
    "Gumoss": "Melpaca",
    "Gumoss (Special)": "Melpaca",
    "Vixy": "Verdash",
    "Hoocrates": "Loupmoon",
    "Teafant": "Felbat",
    "Depresso": "Loupmoon",
    "Cremis": "Verdash",
    "Daedream": "Reindrix",
    "Rushoar": "Kitsun",
    "Nox": "Digtoise",
    "Fuddler": "Reindrix",
    "Killamari": "Mozzarina",
    "Mau": "Felbat",
    "Mau Cryst": "Fenglope",
    "Celaray": "Katress",
    "Direhowl": "Arsox",
    "Tocotoco": "Caprity",
    "Flopie": "Mozzarina",
    "Mozzarina": "Blazehowl",
    "Bristla": "Eikthyrdeer",
    "Gobfin": "Dinossom",
    "Gobfin Ignis": "Dinossom",
    "Hangyu": "Fenglope",
    "Hangyu Cryst": "Fenglope",
    "Mossanda": "Wumpo Botan",
    "Mossanda Lux": "Wumpo",
    "Woolipop": "Broncherry",
    "Caprity": "Rayhound",
    "Melpaca": "Blazehowl",
    "Eikthyrdeer": "Rayhound",
    "Eikthyrdeer Terra": "Blazehowl",
    "Nitewing": "Wumpo Botan",
    "Ribunny": "Eikthyrdeer",
    "Incineram": "Surfent",
    "Incineram Noct": "Surfent",
    "Cinnamoth": "Grintale",
    "Arsox": "Vanwyrm",
    "Dumud": "Blazehowl",
    "Cawgnito": "Chillet",
    "Leezpunk": "Kitsun",
    "Leezpunk Ignis": "Kitsun",
    "Loupmoon": "Rayhound",
    "Galeclaw": "Petallia",
    "Robinquill": "Petallia",
    "Robinquill Terra": "Foxcicle",
    "Gorirat": "Arsox",
    "Beegarde": "Chillet",
    "Elizabee": "Mossanda",
    "Grintale": "Penking",
    "Swee": "Eikthyrdeer",
    "Sweepa": "Kingpaca",
    "Chillet": "Vanwyrm",
    "Univolt": "Incineram",
    "Foxcicle": "Bushi",
    "Pyrin": "Sibelyx",
    "Pyrin Noct": "Ragnahawk",
    "Reindrix": "Blazehowl",
    "Rayhound": "Bushi",
    "Kitsun": "Univolt",
    "Dazzi": "Celaray",
    "Lunaris": "Dinossom",
    "Dinossom": "Univolt",
    "Dinossom Lux": "Univolt",
    "Surfent": "Elphidran",
    "Surfent Terra": "Elphidran",
    "Maraith": "Digtoise",
    "Digtoise": "Univolt",
    "Tombat": "Bushi",
    "Lovander": "Rayhound",
    "Flambelle": "Fenglope",
    "Vanwyrm": "Incineram",
    "Vanwyrm Cryst": "Anubis",
    "Bushi": "Incineram",
    "Beakon": "Ragnahawk",
    "Ragnahawk": "Sibelyx",
    "Katress": "Incineram",
    "Wixen": "Digtoise",
    "Verdash": "Foxcicle",
    "Vaelet": "Arsox",
    "Sibelyx": "Cinnamoth",
    "Elphidran": "Elphidran",
    "Elphidran Aqua": "Elphidran Aqua",
    "Kelpsea": "Dumud",
    "Kelpsea Ignis": "Dumud",
    "Azurobe": "Penking",
    "Cryolinx": "Elizabee",
    "Blazehowl": "Bushi",
    "Blazehowl Noct": "Incineram",
    "Relaxaurus": "Sweepa",
    "Relaxaurus Lux": "Sweepa",
    "Broncherry": "Katress",
    "Broncherry Aqua": "Univolt",
    "Petallia": "Vanwyrm",
    "Reptyro": "Nitewing",
    "Ice Reptyro": "Ragnahawk",
    "Kingpaca": "Azurobe",
    "Ice Kingpaca": "Wumpo Botan",
    "Mammorest": "Nitewing",
    "Mammorest Cryst": "Sweepa",
    "Wumpo": "Azurobe",
    "Wumpo Botan": "Azurobe",
    "Warsect": "Mossanda",
    "Fenglope": "Tombat",
    "Felbat": "Foxcicle",
    "Quivern": "Sibelyx",
    "Blazamut": "Relaxaurus",
    "Helzephyr": "Pyrin",
    "Astegon": "Warsect",
    "Menasting": "Sweepa",
    "Anubis": "Elphidran",
    "Jormuntide": "Nitewing",
    "Jormuntide Ignis": "Nitewing",
    "Suzaku": "Relaxaurus",
    "Suzaku Aqua": "Relaxaurus",
    "Grizzbolt": "Pyrin",
    "Lyleen": "Ragnahawk",
    "Lyleen Noct": "Pyrin",
    "Faleris": "Sibelyx",
    "Orserk": "Elizabee",
    "Shadowbeak": "Mammorest",
    "Paladius": "Jormuntide",
    "Necromus": "Mammorest",
    "Frostallion": "Reptyro",
    "Frostallion Noct": "Jormuntide",
    "Jetragon": "Jormuntide"
  },
  "Kelpsea": {
    "Lamball": "Jolthog",
    "Cattiva": "Jolthog",
    "Chikipi": "Depresso",
    "Lifmunk": "Tocotoco",
    "Foxparks": "Fuack",
    "Fuack": "Killamari",
    "Sparkit": "Tocotoco",
    "Tanzee": "Kelpsea",
    "Rooby": "Dazzi",
    "Pengullet": "Swee",
    "Penking": "Melpaca",
    "Jolthog": "Bristla",
    "Jolthog Cryst": "Ribunny",
    "Gumoss": "Tanzee",
    "Gumoss (Special)": "Tanzee",
    "Vixy": "Pengullet",
    "Hoocrates": "Bristla",
    "Teafant": "Jolthog",
    "Depresso": "Bristla",
    "Cremis": "Pengullet",
    "Daedream": "Tanzee",
    "Rushoar": "Woolipop",
    "Nox": "Fuddler",
    "Fuddler": "Gumoss",
    "Killamari": "Kelpsea Ignis",
    "Mau": "Jolthog",
    "Mau Cryst": "Pengullet",
    "Celaray": "Direhowl",
    "Direhowl": "Wixen",
    "Tocotoco": "Swee",
    "Flopie": "Kelpsea Ignis",
    "Mozzarina": "Gobfin",
    "Bristla": "Killamari",
    "Gobfin": "Nox",
    "Gobfin Ignis": "Nox",
    "Hangyu": "Tocotoco",
    "Hangyu Cryst": "Tocotoco",
    "Mossanda": "Digtoise",
    "Mossanda Lux": "Kitsun",
    "Woolipop": "Fuddler",
    "Caprity": "Gobfin",
    "Melpaca": "Cawgnito",
    "Eikthyrdeer": "Gobfin",
    "Eikthyrdeer Terra": "Cawgnito",
    "Nitewing": "Digtoise",
    "Ribunny": "Killamari",
    "Incineram": "Eikthyrdeer",
    "Incineram Noct": "Eikthyrdeer",
    "Cinnamoth": "Reindrix",
    "Arsox": "Galeclaw",
    "Dumud": "Cawgnito",
    "Cawgnito": "Wixen",
    "Leezpunk": "Woolipop",
    "Leezpunk Ignis": "Dazzi",
    "Loupmoon": "Lunaris",
    "Galeclaw": "Maraith",
    "Robinquill": "Rushoar",
    "Robinquill Terra": "Rushoar",
    "Gorirat": "Maraith",
    "Beegarde": "Wixen",
    "Elizabee": "Arsox",
    "Grintale": "Melpaca",
    "Swee": "Flopie",
    "Sweepa": "Kitsun",
    "Chillet": "Galeclaw",
    "Univolt": "Fenglope",
    "Foxcicle": "Felbat",
    "Pyrin": "Dinossom",
    "Pyrin Noct": "Tombat",
    "Reindrix": "Beegarde",
    "Rayhound": "Felbat",
    "Kitsun": "Gorirat",
    "Dazzi": "Daedream",
    "Lunaris": "Woolipop",
    "Dinossom": "Gorirat",
    "Dinossom Lux": "Galeclaw",
    "Surfent": "Mozzarina",
    "Surfent Terra": "Mozzarina",
    "Maraith": "Dazzi",
    "Digtoise": "Direhowl",
    "Tombat": "Felbat",
    "Lovander": "Lunaris",
    "Flambelle": "Fuack",
    "Vanwyrm": "Loupmoon",
    "Vanwyrm Cryst": "Lovander",
    "Bushi": "Loupmoon",
    "Beakon": "Rayhound",
    "Ragnahawk": "Dinossom",
    "Katress": "Fenglope",
    "Wixen": "Dazzi",
    "Verdash": "Rushoar",
    "Vaelet": "Rooby",
    "Sibelyx": "Digtoise",
    "Elphidran": "Dumud",
    "Elphidran Aqua": "Dumud",
    "Kelpsea": "Kelpsea",
    "Kelpsea Ignis": "Kelpsea",
    "Azurobe": "Reindrix",
    "Cryolinx": "Katress",
    "Blazehowl": "Fenglope",
    "Blazehowl Noct": "Loupmoon",
    "Relaxaurus": "Foxcicle",
    "Relaxaurus Lux": "Foxcicle",
    "Broncherry": "Direhowl",
    "Broncherry Aqua": "Vaelet",
    "Petallia": "Robinquill",
    "Reptyro": "Arsox",
    "Ice Reptyro": "Tombat",
    "Kingpaca": "Broncherry",
    "Ice Kingpaca": "Digtoise",
    "Mammorest": "Petallia",
    "Mammorest Cryst": "Petallia",
    "Wumpo": "Broncherry",
    "Wumpo Botan": "Celaray",
    "Warsect": "Chillet",
    "Fenglope": "Leezpunk",
    "Felbat": "Rushoar",
    "Quivern": "Chillet",
    "Blazamut": "Bushi",
    "Helzephyr": "Rayhound",
    "Astegon": "Blazehowl",
    "Menasting": "Foxcicle",
    "Anubis": "Eikthyrdeer",
    "Jormuntide": "Arsox",
    "Jormuntide Ignis": "Arsox",
    "Suzaku": "Vanwyrm",
    "Suzaku Aqua": "Bushi",
    "Grizzbolt": "Rayhound",
    "Lyleen": "Tombat",
    "Lyleen Noct": "Rayhound",
    "Faleris": "Dinossom",
    "Orserk": "Katress",
    "Shadowbeak": "Vanwyrm",
    "Paladius": "Univolt",
    "Necromus": "Vanwyrm",
    "Frostallion": "Univolt",
    "Frostallion Noct": "Univolt",
    "Jetragon": "Univolt"
  },
  "Kelpsea Ignis": {
    "variant": true,
    "Lamball": "Jolthog",
    "Cattiva": "Jolthog",
    "Chikipi": "Depresso",
    "Lifmunk": "Pengullet",
    "Foxparks": "Tocotoco",
    "Fuack": "Swee",
    "Sparkit": "Tocotoco",
    "Tanzee": "Kelpsea",
    "Rooby": "Dazzi",
    "Pengullet": "Ribunny",
    "Penking": "Dumud",
    "Jolthog": "Bristla",
    "Jolthog Cryst": "Bristla",
    "Gumoss": "Kelpsea",
    "Gumoss (Special)": "Kelpsea",
    "Vixy": "Jolthog",
    "Hoocrates": "Fuack",
    "Teafant": "Depresso",
    "Depresso": "Bristla",
    "Cremis": "Jolthog",
    "Daedream": "Tanzee",
    "Rushoar": "Dazzi",
    "Nox": "Fuddler",
    "Fuddler": "Tanzee",
    "Killamari": "Flopie",
    "Mau": "Jolthog",
    "Mau Cryst": "Pengullet",
    "Celaray": "Beegarde",
    "Direhowl": "Wixen",
    "Tocotoco": "Swee",
    "Flopie": "Kelpsea Ignis",
    "Mozzarina": "Gobfin",
    "Bristla": "Killamari",
    "Gobfin": "Nox",
    "Gobfin Ignis": "Woolipop",
    "Hangyu": "Tocotoco",
    "Hangyu Cryst": "Pengullet",
    "Mossanda": "Digtoise",
    "Mossanda Lux": "Kitsun",
    "Woolipop": "Daedream",
    "Caprity": "Lunaris",
    "Melpaca": "Cawgnito",
    "Eikthyrdeer": "Gobfin",
    "Eikthyrdeer Terra": "Gobfin",
    "Nitewing": "Digtoise",
    "Ribunny": "Killamari",
    "Incineram": "Caprity",
    "Incineram Noct": "Eikthyrdeer",
    "Cinnamoth": "Reindrix",
    "Arsox": "Galeclaw",
    "Dumud": "Cawgnito",
    "Cawgnito": "Nox",
    "Leezpunk": "Woolipop",
    "Leezpunk Ignis": "Dazzi",
    "Loupmoon": "Lunaris",
    "Galeclaw": "Maraith",
    "Robinquill": "Maraith",
    "Robinquill Terra": "Rushoar",
    "Gorirat": "Rooby",
    "Beegarde": "Wixen",
    "Elizabee": "Chillet",
    "Grintale": "Melpaca",
    "Swee": "Killamari",
    "Sweepa": "Digtoise",
    "Chillet": "Galeclaw",
    "Univolt": "Fenglope",
    "Foxcicle": "Robinquill",
    "Pyrin": "Dinossom",
    "Pyrin Noct": "Tombat",
    "Reindrix": "Cawgnito",
    "Rayhound": "Felbat",
    "Kitsun": "Vaelet",
    "Dazzi": "Gumoss",
    "Lunaris": "Woolipop",
    "Dinossom": "Gorirat",
    "Dinossom Lux": "Gorirat",
    "Surfent": "Eikthyrdeer",
    "Surfent Terra": "Mozzarina",
    "Maraith": "Dazzi",
    "Digtoise": "Direhowl",
    "Tombat": "Felbat",
    "Lovander": "Lunaris",
    "Flambelle": "Tocotoco",
    "Vanwyrm": "Loupmoon",
    "Vanwyrm Cryst": "Loupmoon",
    "Bushi": "Loupmoon",
    "Beakon": "Tombat",
    "Ragnahawk": "Kitsun",
    "Katress": "Fenglope",
    "Wixen": "Dazzi",
    "Verdash": "Rushoar",
    "Vaelet": "Wixen",
    "Sibelyx": "Broncherry",
    "Elphidran": "Mozzarina",
    "Elphidran Aqua": "Dumud",
    "Kelpsea": "Kelpsea",
    "Kelpsea Ignis": "Kelpsea Ignis",
    "Azurobe": "Melpaca",
    "Cryolinx": "Katress",
    "Blazehowl": "Verdash",
    "Blazehowl Noct": "Fenglope",
    "Relaxaurus": "Petallia",
    "Relaxaurus Lux": "Foxcicle",
    "Broncherry": "Direhowl",
    "Broncherry Aqua": "Direhowl",
    "Petallia": "Galeclaw",
    "Reptyro": "Arsox",
    "Ice Reptyro": "Tombat",
    "Kingpaca": "Celaray",
    "Ice Kingpaca": "Digtoise",
    "Mammorest": "Arsox",
    "Mammorest Cryst": "Petallia",
    "Wumpo": "Broncherry",
    "Wumpo Botan": "Reindrix",
    "Warsect": "Chillet",
    "Fenglope": "Rushoar",
    "Felbat": "Rushoar",
    "Quivern": "Dinossom",
    "Blazamut": "Bushi",
    "Helzephyr": "Rayhound",
    "Astegon": "Blazehowl",
    "Menasting": "Foxcicle",
    "Anubis": "Eikthyrdeer",
    "Jormuntide": "Arsox",
    "Jormuntide Ignis": "Arsox",
    "Suzaku": "Vanwyrm",
    "Suzaku Aqua": "Vanwyrm",
    "Grizzbolt": "Rayhound",
    "Lyleen": "Foxcicle",
    "Lyleen Noct": "Rayhound",
    "Faleris": "Dinossom",
    "Orserk": "Blazehowl",
    "Shadowbeak": "Vanwyrm",
    "Paladius": "Univolt",
    "Necromus": "Univolt",
    "Frostallion": "Katress",
    "Frostallion Noct": "Univolt",
    "Jetragon": "Univolt"
  },
  "Azurobe": {
    "Lamball": "Fenglope",
    "Cattiva": "Fenglope",
    "Chikipi": "Felbat",
    "Lifmunk": "Loupmoon",
    "Foxparks": "Loupmoon",
    "Fuack": "Eikthyrdeer",
    "Sparkit": "Loupmoon",
    "Tanzee": "Reindrix",
    "Rooby": "Kitsun",
    "Pengullet": "Eikthyrdeer",
    "Penking": "Grintale",
    "Jolthog": "Caprity",
    "Jolthog Cryst": "Caprity",
    "Gumoss": "Celaray",
    "Gumoss (Special)": "Celaray",
    "Vixy": "Fenglope",
    "Hoocrates": "Loupmoon",
    "Teafant": "Verdash",
    "Depresso": "Lovander",
    "Cremis": "Fenglope",
    "Daedream": "Broncherry",
    "Rushoar": "Dinossom",
    "Nox": "Digtoise",
    "Fuddler": "Broncherry",
    "Killamari": "Dumud",
    "Mau": "Verdash",
    "Mau Cryst": "Fenglope",
    "Celaray": "Univolt",
    "Direhowl": "Petallia",
    "Tocotoco": "Eikthyrdeer",
    "Flopie": "Melpaca",
    "Mozzarina": "Blazehowl",
    "Bristla": "Mozzarina",
    "Gobfin": "Arsox",
    "Gobfin Ignis": "Chillet",
    "Hangyu": "Loupmoon",
    "Hangyu Cryst": "Loupmoon",
    "Mossanda": "Wumpo",
    "Mossanda Lux": "Sibelyx",
    "Woolipop": "Digtoise",
    "Caprity": "Blazehowl",
    "Melpaca": "Katress",
    "Eikthyrdeer": "Blazehowl",
    "Eikthyrdeer Terra": "Katress",
    "Nitewing": "Wumpo",
    "Ribunny": "Mozzarina",
    "Incineram": "Elphidran",
    "Incineram Noct": "Elphidran",
    "Cinnamoth": "Azurobe",
    "Arsox": "Bushi",
    "Dumud": "Katress",
    "Cawgnito": "Arsox",
    "Leezpunk": "Dinossom",
    "Leezpunk Ignis": "Dinossom",
    "Loupmoon": "Rayhound",
    "Galeclaw": "Foxcicle",
    "Robinquill": "Foxcicle",
    "Robinquill Terra": "Tombat",
    "Gorirat": "Foxcicle",
    "Beegarde": "Arsox",
    "Elizabee": "Nitewing",
    "Grintale": "Azurobe",
    "Swee": "Dumud",
    "Sweepa": "Sibelyx",
    "Chillet": "Vanwyrm",
    "Univolt": "Incineram",
    "Foxcicle": "Bushi",
    "Pyrin": "Mossanda",
    "Pyrin Noct": "Pyrin",
    "Reindrix": "Univolt",
    "Rayhound": "Bushi",
    "Kitsun": "Vanwyrm",
    "Dazzi": "Digtoise",
    "Lunaris": "Chillet",
    "Dinossom": "Vanwyrm",
    "Dinossom Lux": "Vanwyrm",
    "Surfent": "Elphidran",
    "Surfent Terra": "Penking",
    "Maraith": "Kitsun",
    "Digtoise": "Univolt",
    "Tombat": "Bushi",
    "Lovander": "Blazehowl",
    "Flambelle": "Loupmoon",
    "Vanwyrm": "Anubis",
    "Vanwyrm Cryst": "Surfent",
    "Bushi": "Anubis",
    "Beakon": "Pyrin",
    "Ragnahawk": "Sibelyx",
    "Katress": "Incineram",
    "Wixen": "Kitsun",
    "Verdash": "Tombat",
    "Vaelet": "Petallia",
    "Sibelyx": "Wumpo Botan",
    "Elphidran": "Penking",
    "Elphidran Aqua": "Penking",
    "Kelpsea": "Reindrix",
    "Kelpsea Ignis": "Melpaca",
    "Azurobe": "Azurobe",
    "Cryolinx": "Jormuntide",
    "Blazehowl": "Incineram",
    "Blazehowl Noct": "Incineram",
    "Relaxaurus": "Ragnahawk",
    "Relaxaurus Lux": "Ragnahawk",
    "Broncherry": "Univolt",
    "Broncherry Aqua": "Univolt",
    "Petallia": "Bushi",
    "Reptyro": "Sweepa",
    "Ice Reptyro": "Pyrin",
    "Kingpaca": "Wumpo Botan",
    "Ice Kingpaca": "Kingpaca",
    "Mammorest": "Sweepa",
    "Mammorest Cryst": "Sweepa",
    "Wumpo": "Wumpo Botan",
    "Wumpo Botan": "Cinnamoth",
    "Warsect": "Nitewing",
    "Fenglope": "Rayhound",
    "Felbat": "Tombat",
    "Quivern": "Nitewing",
    "Blazamut": "Menasting",
    "Helzephyr": "Warsect",
    "Astegon": "Reptyro",
    "Menasting": "Ragnahawk",
    "Anubis": "Elphidran",
    "Jormuntide": "Sweepa",
    "Jormuntide Ignis": "Sweepa",
    "Suzaku": "Relaxaurus",
    "Suzaku Aqua": "Menasting",
    "Grizzbolt": "Quivern",
    "Lyleen": "Ragnahawk",
    "Lyleen Noct": "Pyrin",
    "Faleris": "Mossanda",
    "Orserk": "Reptyro",
    "Shadowbeak": "Relaxaurus",
    "Paladius": "Relaxaurus",
    "Necromus": "Relaxaurus",
    "Frostallion": "Jormuntide",
    "Frostallion Noct": "Mammorest",
    "Jetragon": "Mammorest"
  },
  "Cryolinx": {
    "Lamball": "Chillet",
    "Cattiva": "Arsox",
    "Chikipi": "Dinossom",
    "Lifmunk": "Petallia",
    "Foxparks": "Foxcicle",
    "Fuack": "Rayhound",
    "Sparkit": "Foxcicle",
    "Tanzee": "Univolt",
    "Rooby": "Bushi",
    "Pengullet": "Rayhound",
    "Penking": "Reptyro",
    "Jolthog": "Tombat",
    "Jolthog Cryst": "Tombat",
    "Gumoss": "Univolt",
    "Gumoss (Special)": "Univolt",
    "Vixy": "Arsox",
    "Hoocrates": "Foxcicle",
    "Teafant": "Dinossom",
    "Depresso": "Tombat",
    "Cremis": "Arsox",
    "Daedream": "Univolt",
    "Rushoar": "Bushi",
    "Nox": "Vanwyrm",
    "Fuddler": "Univolt",
    "Killamari": "Blazehowl",
    "Mau": "Chillet",
    "Mau Cryst": "Arsox",
    "Celaray": "Azurobe",
    "Direhowl": "Incineram",
    "Tocotoco": "Rayhound",
    "Flopie": "Blazehowl",
    "Mozzarina": "Penking",
    "Bristla": "Rayhound",
    "Gobfin": "Incineram",
    "Gobfin Ignis": "Incineram",
    "Hangyu": "Petallia",
    "Hangyu Cryst": "Petallia",
    "Mossanda": "Relaxaurus",
    "Mossanda Lux": "Menasting",
    "Woolipop": "Vanwyrm",
    "Caprity": "Elphidran",
    "Melpaca": "Grintale",
    "Eikthyrdeer": "Penking",
    "Eikthyrdeer Terra": "Penking",
    "Nitewing": "Relaxaurus",
    "Ribunny": "Blazehowl",
    "Incineram": "Pyrin",
    "Incineram Noct": "Pyrin",
    "Cinnamoth": "Jormuntide",
    "Arsox": "Wumpo",
    "Dumud": "Grintale",
    "Cawgnito": "Incineram",
    "Leezpunk": "Bushi",
    "Leezpunk Ignis": "Bushi",
    "Loupmoon": "Elphidran",
    "Galeclaw": "Anubis",
    "Robinquill": "Anubis",
    "Robinquill Terra": "Anubis",
    "Gorirat": "Incineram",
    "Beegarde": "Incineram",
    "Elizabee": "Beakon",
    "Grintale": "Reptyro",
    "Swee": "Blazehowl",
    "Sweepa": "Relaxaurus",
    "Chillet": "Wumpo",
    "Univolt": "Sweepa",
    "Foxcicle": "Sibelyx",
    "Pyrin": "Menasting",
    "Pyrin Noct": "Helzephyr",
    "Reindrix": "Azurobe",
    "Rayhound": "Mossanda",
    "Kitsun": "Wumpo Botan",
    "Dazzi": "Univolt",
    "Lunaris": "Bushi",
    "Dinossom": "Wumpo Botan",
    "Dinossom Lux": "Kingpaca",
    "Surfent": "Warsect",
    "Surfent Terra": "Warsect",
    "Maraith": "Bushi",
    "Digtoise": "Cinnamoth",
    "Tombat": "Sibelyx",
    "Lovander": "Elphidran",
    "Flambelle": "Foxcicle",
    "Vanwyrm": "Sweepa",
    "Vanwyrm Cryst": "Ragnahawk",
    "Bushi": "Ragnahawk",
    "Beakon": "Helzephyr",
    "Ragnahawk": "Menasting",
    "Katress": "Nitewing",
    "Wixen": "Bushi",
    "Verdash": "Surfent",
    "Vaelet": "Incineram",
    "Sibelyx": "Relaxaurus",
    "Elphidran": "Elizabee",
    "Elphidran Aqua": "Elizabee",
    "Kelpsea": "Katress",
    "Kelpsea Ignis": "Katress",
    "Azurobe": "Jormuntide",
    "Cryolinx": "Cryolinx",
    "Blazehowl": "Nitewing",
    "Blazehowl Noct": "Sweepa",
    "Relaxaurus": "Beakon",
    "Relaxaurus Lux": "Helzephyr",
    "Broncherry": "Azurobe",
    "Broncherry Aqua": "Wumpo Botan",
    "Petallia": "Sibelyx",
    "Reptyro": "Beakon",
    "Ice Reptyro": "Helzephyr",
    "Kingpaca": "Mammorest",
    "Ice Kingpaca": "Relaxaurus",
    "Mammorest": "Beakon",
    "Mammorest Cryst": "Beakon",
    "Wumpo": "Mammorest",
    "Wumpo Botan": "Jormuntide",
    "Warsect": "Beakon",
    "Fenglope": "Surfent",
    "Felbat": "Anubis",
    "Quivern": "Beakon",
    "Blazamut": "Suzaku",
    "Helzephyr": "Astegon",
    "Astegon": "Cryolinx",
    "Menasting": "Helzephyr",
    "Anubis": "Quivern",
    "Jormuntide": "Beakon",
    "Jormuntide Ignis": "Beakon",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Astegon",
    "Lyleen": "Helzephyr",
    "Lyleen Noct": "Astegon",
    "Faleris": "Menasting",
    "Orserk": "Cryolinx",
    "Shadowbeak": "Cryolinx",
    "Paladius": "Cryolinx",
    "Necromus": "Cryolinx",
    "Frostallion": "Cryolinx",
    "Frostallion Noct": "Cryolinx",
    "Jetragon": "Cryolinx"
  },
  "Blazehowl": {
    "Lamball": "Gobfin",
    "Cattiva": "Gobfin",
    "Chikipi": "Lunaris",
    "Lifmunk": "Beegarde",
    "Foxparks": "Direhowl",
    "Fuack": "Robinquill",
    "Sparkit": "Direhowl",
    "Tanzee": "Fenglope",
    "Rooby": "Caprity",
    "Pengullet": "Galeclaw",
    "Penking": "Incineram",
    "Jolthog": "Gorirat",
    "Jolthog Cryst": "Galeclaw",
    "Gumoss": "Fenglope",
    "Gumoss (Special)": "Fenglope",
    "Vixy": "Cawgnito",
    "Hoocrates": "Vaelet",
    "Teafant": "Lunaris",
    "Depresso": "Gorirat",
    "Cremis": "Cawgnito",
    "Daedream": "Fenglope",
    "Rushoar": "Eikthyrdeer",
    "Nox": "Loupmoon",
    "Fuddler": "Loupmoon",
    "Killamari": "Felbat",
    "Mau": "Gobfin",
    "Mau Cryst": "Cawgnito",
    "Celaray": "Arsox",
    "Direhowl": "Melpaca",
    "Tocotoco": "Galeclaw",
    "Flopie": "Verdash",
    "Mozzarina": "Dinossom",
    "Bristla": "Robinquill",
    "Gobfin": "Dumud",
    "Gobfin Ignis": "Mozzarina",
    "Hangyu": "Direhowl",
    "Hangyu Cryst": "Beegarde",
    "Mossanda": "Anubis",
    "Mossanda Lux": "Elphidran",
    "Woolipop": "Loupmoon",
    "Caprity": "Dinossom",
    "Melpaca": "Chillet",
    "Eikthyrdeer": "Dinossom",
    "Eikthyrdeer Terra": "Chillet",
    "Nitewing": "Anubis",
    "Ribunny": "Felbat",
    "Incineram": "Vanwyrm",
    "Incineram Noct": "Bushi",
    "Cinnamoth": "Incineram",
    "Arsox": "Tombat",
    "Dumud": "Chillet",
    "Cawgnito": "Dumud",
    "Leezpunk": "Eikthyrdeer",
    "Leezpunk Ignis": "Eikthyrdeer",
    "Loupmoon": "Kitsun",
    "Galeclaw": "Celaray",
    "Robinquill": "Broncherry",
    "Robinquill Terra": "Digtoise",
    "Gorirat": "Reindrix",
    "Beegarde": "Melpaca",
    "Elizabee": "Penking",
    "Grintale": "Incineram",
    "Swee": "Felbat",
    "Sweepa": "Surfent",
    "Chillet": "Tombat",
    "Univolt": "Katress",
    "Foxcicle": "Rayhound",
    "Pyrin": "Elphidran",
    "Pyrin Noct": "Wumpo Botan",
    "Reindrix": "Arsox",
    "Rayhound": "Rayhound",
    "Kitsun": "Foxcicle",
    "Dazzi": "Loupmoon",
    "Lunaris": "Mozzarina",
    "Dinossom": "Foxcicle",
    "Dinossom Lux": "Foxcicle",
    "Surfent": "Bushi",
    "Surfent Terra": "Bushi",
    "Maraith": "Caprity",
    "Digtoise": "Petallia",
    "Tombat": "Rayhound",
    "Lovander": "Kitsun",
    "Flambelle": "Direhowl",
    "Vanwyrm": "Univolt",
    "Vanwyrm Cryst": "Vanwyrm",
    "Bushi": "Univolt",
    "Beakon": "Wumpo",
    "Ragnahawk": "Elphidran",
    "Katress": "Blazehowl",
    "Wixen": "Caprity",
    "Verdash": "Digtoise",
    "Vaelet": "Reindrix",
    "Sibelyx": "Anubis",
    "Elphidran": "Bushi",
    "Elphidran Aqua": "Bushi",
    "Kelpsea": "Fenglope",
    "Kelpsea Ignis": "Verdash",
    "Azurobe": "Incineram",
    "Cryolinx": "Nitewing",
    "Blazehowl": "Blazehowl",
    "Blazehowl Noct": "Univolt",
    "Relaxaurus": "Azurobe",
    "Relaxaurus Lux": "Cinnamoth",
    "Broncherry": "Arsox",
    "Broncherry Aqua": "Petallia",
    "Petallia": "Tombat",
    "Reptyro": "Penking",
    "Ice Reptyro": "Kingpaca",
    "Kingpaca": "Incineram",
    "Ice Kingpaca": "Anubis",
    "Mammorest": "Azurobe",
    "Mammorest Cryst": "Azurobe",
    "Wumpo": "Incineram",
    "Wumpo Botan": "Incineram",
    "Warsect": "Penking",
    "Fenglope": "Digtoise",
    "Felbat": "Blazehowl Noct",
    "Quivern": "Elphidran",
    "Blazamut": "Pyrin",
    "Helzephyr": "Sibelyx",
    "Astegon": "Mossanda",
    "Menasting": "Wumpo Botan",
    "Anubis": "Bushi",
    "Jormuntide": "Grintale",
    "Jormuntide Ignis": "Grintale",
    "Suzaku": "Ragnahawk",
    "Suzaku Aqua": "Pyrin",
    "Grizzbolt": "Sibelyx",
    "Lyleen": "Wumpo Botan",
    "Lyleen Noct": "Wumpo",
    "Faleris": "Elphidran",
    "Orserk": "Nitewing",
    "Shadowbeak": "Ragnahawk",
    "Paladius": "Sweepa",
    "Necromus": "Ragnahawk",
    "Frostallion": "Nitewing",
    "Frostallion Noct": "Sweepa",
    "Jetragon": "Sweepa"
  },
  "Blazehowl Noct": {
    "variant": true,
    "Lamball": "Beegarde",
    "Cattiva": "Direhowl",
    "Chikipi": "Gobfin",
    "Lifmunk": "Vaelet",
    "Foxparks": "Galeclaw",
    "Fuack": "Felbat",
    "Sparkit": "Gorirat",
    "Tanzee": "Loupmoon",
    "Rooby": "Mozzarina",
    "Pengullet": "Felbat",
    "Penking": "Incineram",
    "Jolthog": "Robinquill",
    "Jolthog Cryst": "Robinquill",
    "Gumoss": "Loupmoon",
    "Gumoss (Special)": "Loupmoon",
    "Vixy": "Direhowl",
    "Hoocrates": "Galeclaw",
    "Teafant": "Cawgnito",
    "Depresso": "Galeclaw",
    "Cremis": "Direhowl",
    "Daedream": "Loupmoon",
    "Rushoar": "Dumud",
    "Nox": "Eikthyrdeer",
    "Fuddler": "Loupmoon",
    "Killamari": "Fenglope",
    "Mau": "Cawgnito",
    "Mau Cryst": "Direhowl",
    "Celaray": "Foxcicle",
    "Direhowl": "Broncherry",
    "Tocotoco": "Felbat",
    "Flopie": "Fenglope",
    "Mozzarina": "Arsox",
    "Bristla": "Verdash",
    "Gobfin": "Reindrix",
    "Gobfin Ignis": "Melpaca",
    "Hangyu": "Gorirat",
    "Hangyu Cryst": "Vaelet",
    "Mossanda": "Elphidran",
    "Mossanda Lux": "Elphidran",
    "Woolipop": "Caprity",
    "Caprity": "Chillet",
    "Melpaca": "Petallia",
    "Eikthyrdeer": "Arsox",
    "Eikthyrdeer Terra": "Arsox",
    "Nitewing": "Elphidran",
    "Ribunny": "Verdash",
    "Incineram": "Bushi",
    "Incineram Noct": "Bushi",
    "Cinnamoth": "Anubis",
    "Arsox": "Rayhound",
    "Dumud": "Petallia",
    "Cawgnito": "Reindrix",
    "Leezpunk": "Dumud",
    "Leezpunk Ignis": "Mozzarina",
    "Loupmoon": "Dinossom",
    "Galeclaw": "Digtoise",
    "Robinquill": "Digtoise",
    "Robinquill Terra": "Kitsun",
    "Gorirat": "Digtoise",
    "Beegarde": "Celaray",
    "Elizabee": "Azurobe",
    "Grintale": "Incineram",
    "Swee": "Fenglope",
    "Sweepa": "Elphidran",
    "Chillet": "Rayhound",
    "Univolt": "Univolt",
    "Foxcicle": "Blazehowl",
    "Pyrin": "Penking",
    "Pyrin Noct": "Sibelyx",
    "Reindrix": "Petallia",
    "Rayhound": "Blazehowl",
    "Kitsun": "Tombat",
    "Dazzi": "Lovander",
    "Lunaris": "Melpaca",
    "Dinossom": "Tombat",
    "Dinossom Lux": "Rayhound",
    "Surfent": "Incineram",
    "Surfent Terra": "Incineram",
    "Maraith": "Mozzarina",
    "Digtoise": "Foxcicle",
    "Tombat": "Blazehowl",
    "Lovander": "Chillet",
    "Flambelle": "Gorirat",
    "Vanwyrm": "Vanwyrm",
    "Vanwyrm Cryst": "Bushi",
    "Bushi": "Vanwyrm",
    "Beakon": "Sibelyx",
    "Ragnahawk": "Penking",
    "Katress": "Univolt",
    "Wixen": "Eikthyrdeer",
    "Verdash": "Kitsun",
    "Vaelet": "Broncherry",
    "Sibelyx": "Surfent",
    "Elphidran": "Incineram",
    "Elphidran Aqua": "Incineram",
    "Kelpsea": "Loupmoon",
    "Kelpsea Ignis": "Fenglope",
    "Azurobe": "Incineram",
    "Cryolinx": "Sweepa",
    "Blazehowl": "Univolt",
    "Blazehowl Noct": "Blazehowl Noct",
    "Relaxaurus": "Wumpo Botan",
    "Relaxaurus Lux": "Kingpaca",
    "Broncherry": "Foxcicle",
    "Broncherry Aqua": "Tombat",
    "Petallia": "Rayhound",
    "Reptyro": "Azurobe",
    "Ice Reptyro": "Sibelyx",
    "Kingpaca": "Anubis",
    "Ice Kingpaca": "Surfent",
    "Mammorest": "Wumpo Botan",
    "Mammorest Cryst": "Wumpo Botan",
    "Wumpo": "Anubis",
    "Wumpo Botan": "Anubis",
    "Warsect": "Azurobe",
    "Fenglope": "Kitsun",
    "Felbat": "Digtoise",
    "Quivern": "Grintale",
    "Blazamut": "Warsect",
    "Helzephyr": "Mossanda",
    "Astegon": "Sweepa",
    "Menasting": "Wumpo",
    "Anubis": "Bushi",
    "Jormuntide": "Cinnamoth",
    "Jormuntide Ignis": "Cinnamoth",
    "Suzaku": "Pyrin",
    "Suzaku Aqua": "Quivern",
    "Grizzbolt": "Mossanda",
    "Lyleen": "Wumpo",
    "Lyleen Noct": "Sibelyx",
    "Faleris": "Penking",
    "Orserk": "Sweepa",
    "Shadowbeak": "Pyrin",
    "Paladius": "Ragnahawk",
    "Necromus": "Pyrin",
    "Frostallion": "Sweepa",
    "Frostallion Noct": "Ragnahawk",
    "Jetragon": "Ragnahawk"
  },
  "Relaxaurus": {
    "Lamball": "Reindrix",
    "Cattiva": "Celaray",
    "Chikipi": "Melpaca",
    "Lifmunk": "Digtoise",
    "Foxparks": "Digtoise",
    "Fuack": "Chillet",
    "Sparkit": "Relaxaurus Lux",
    "Tanzee": "Foxcicle",
    "Rooby": "Blazehowl",
    "Pengullet": "Dinossom",
    "Penking": "Sweepa",
    "Jolthog": "Kitsun",
    "Jolthog Cryst": "Dinossom",
    "Gumoss": "Foxcicle",
    "Gumoss (Special)": "Foxcicle",
    "Vixy": "Broncherry",
    "Hoocrates": "Kitsun",
    "Teafant": "Melpaca",
    "Depresso": "Kitsun",
    "Cremis": "Celaray",
    "Daedream": "Tombat",
    "Rushoar": "Blazehowl",
    "Nox": "Rayhound",
    "Fuddler": "Tombat",
    "Killamari": "Arsox",
    "Mau": "Reindrix",
    "Mau Cryst": "Broncherry",
    "Celaray": "Anubis",
    "Direhowl": "Univolt",
    "Tocotoco": "Dinossom",
    "Flopie": "Petallia",
    "Mozzarina": "Incineram",
    "Bristla": "Chillet",
    "Gobfin": "Univolt",
    "Gobfin Ignis": "Univolt",
    "Hangyu": "Digtoise",
    "Hangyu Cryst": "Digtoise",
    "Mossanda": "Pyrin",
    "Mossanda Lux": "Elizabee",
    "Woolipop": "Rayhound",
    "Caprity": "Incineram",
    "Melpaca": "Incineram",
    "Eikthyrdeer": "Incineram",
    "Eikthyrdeer Terra": "Incineram",
    "Nitewing": "Quivern",
    "Ribunny": "Arsox",
    "Incineram": "Mossanda",
    "Incineram Noct": "Mossanda",
    "Cinnamoth": "Ragnahawk",
    "Arsox": "Elphidran",
    "Dumud": "Incineram",
    "Cawgnito": "Univolt",
    "Leezpunk": "Katress",
    "Leezpunk Ignis": "Blazehowl",
    "Loupmoon": "Incineram",
    "Galeclaw": "Vanwyrm",
    "Robinquill": "Vanwyrm",
    "Robinquill Terra": "Bushi",
    "Gorirat": "Vanwyrm",
    "Beegarde": "Univolt",
    "Elizabee": "Jormuntide",
    "Grintale": "Sweepa",
    "Swee": "Arsox",
    "Sweepa": "Warsect",
    "Chillet": "Elphidran",
    "Univolt": "Wumpo Botan",
    "Foxcicle": "Penking",
    "Pyrin": "Reptyro",
    "Pyrin Noct": "Menasting",
    "Reindrix": "Anubis",
    "Rayhound": "Grintale",
    "Kitsun": "Surfent",
    "Dazzi": "Tombat",
    "Lunaris": "Katress",
    "Dinossom": "Elphidran",
    "Dinossom Lux": "Elphidran",
    "Surfent": "Nitewing",
    "Surfent Terra": "Nitewing",
    "Maraith": "Blazehowl",
    "Digtoise": "Anubis",
    "Tombat": "Penking",
    "Lovander": "Incineram",
    "Flambelle": "Digtoise",
    "Vanwyrm": "Kingpaca",
    "Vanwyrm Cryst": "Sibelyx",
    "Bushi": "Wumpo",
    "Beakon": "Menasting",
    "Ragnahawk": "Elizabee",
    "Katress": "Cinnamoth",
    "Wixen": "Blazehowl",
    "Verdash": "Bushi",
    "Vaelet": "Vanwyrm",
    "Sibelyx": "Pyrin",
    "Elphidran": "Sweepa",
    "Elphidran Aqua": "Sweepa",
    "Kelpsea": "Foxcicle",
    "Kelpsea Ignis": "Petallia",
    "Azurobe": "Ragnahawk",
    "Cryolinx": "Beakon",
    "Blazehowl": "Azurobe",
    "Blazehowl Noct": "Wumpo Botan",
    "Relaxaurus": "Relaxaurus",
    "Relaxaurus Lux": "Relaxaurus",
    "Broncherry": "Anubis",
    "Broncherry Aqua": "Surfent",
    "Petallia": "Elphidran",
    "Reptyro": "Mammorest",
    "Ice Reptyro": "Menasting",
    "Kingpaca": "Ragnahawk",
    "Ice Kingpaca": "Pyrin",
    "Mammorest": "Relaxaurus",
    "Mammorest Cryst": "Relaxaurus",
    "Wumpo": "Pyrin",
    "Wumpo Botan": "Ragnahawk",
    "Warsect": "Jormuntide",
    "Fenglope": "Bushi",
    "Felbat": "Bushi",
    "Quivern": "Jormuntide",
    "Blazamut": "Astegon",
    "Helzephyr": "Beakon",
    "Astegon": "Beakon",
    "Menasting": "Relaxaurus",
    "Anubis": "Nitewing",
    "Jormuntide": "Mammorest",
    "Jormuntide Ignis": "Mammorest",
    "Suzaku": "Astegon",
    "Suzaku Aqua": "Astegon",
    "Grizzbolt": "Orserk",
    "Lyleen": "Menasting",
    "Lyleen Noct": "Menasting",
    "Faleris": "Reptyro",
    "Orserk": "Beakon",
    "Shadowbeak": "Astegon",
    "Paladius": "Helzephyr",
    "Necromus": "Helzephyr",
    "Frostallion": "Helzephyr",
    "Frostallion Noct": "Helzephyr",
    "Jetragon": "Helzephyr"
  },
  "Relaxaurus Lux": {
    "variant": true,
    "Lamball": "Celaray",
    "Cattiva": "Broncherry",
    "Chikipi": "Melpaca",
    "Lifmunk": "Digtoise",
    "Foxparks": "Kitsun",
    "Fuack": "Chillet",
    "Sparkit": "Digtoise",
    "Tanzee": "Foxcicle",
    "Rooby": "Blazehowl",
    "Pengullet": "Dinossom",
    "Penking": "Sweepa",
    "Jolthog": "Dinossom",
    "Jolthog Cryst": "Dinossom",
    "Gumoss": "Tombat",
    "Gumoss (Special)": "Tombat",
    "Vixy": "Broncherry",
    "Hoocrates": "Kitsun",
    "Teafant": "Reindrix",
    "Depresso": "Kitsun",
    "Cremis": "Broncherry",
    "Daedream": "Tombat",
    "Rushoar": "Katress",
    "Nox": "Rayhound",
    "Fuddler": "Tombat",
    "Killamari": "Petallia",
    "Mau": "Reindrix",
    "Mau Cryst": "Digtoise",
    "Celaray": "Anubis",
    "Direhowl": "Vanwyrm",
    "Tocotoco": "Chillet",
    "Flopie": "Petallia",
    "Mozzarina": "Incineram",
    "Bristla": "Arsox",
    "Gobfin": "Univolt",
    "Gobfin Ignis": "Univolt",
    "Hangyu": "Digtoise",
    "Hangyu Cryst": "Digtoise",
    "Mossanda": "Quivern",
    "Mossanda Lux": "Elizabee",
    "Woolipop": "Rayhound",
    "Caprity": "Incineram",
    "Melpaca": "Anubis",
    "Eikthyrdeer": "Incineram",
    "Eikthyrdeer Terra": "Incineram",
    "Nitewing": "Warsect",
    "Ribunny": "Arsox",
    "Incineram": "Mossanda",
    "Incineram Noct": "Nitewing",
    "Cinnamoth": "Ragnahawk",
    "Arsox": "Elphidran",
    "Dumud": "Incineram",
    "Cawgnito": "Univolt",
    "Leezpunk": "Katress",
    "Leezpunk Ignis": "Blazehowl",
    "Loupmoon": "Incineram",
    "Galeclaw": "Vanwyrm",
    "Robinquill": "Bushi",
    "Robinquill Terra": "Bushi",
    "Gorirat": "Vanwyrm",
    "Beegarde": "Univolt",
    "Elizabee": "Mammorest",
    "Grintale": "Ragnahawk",
    "Swee": "Arsox",
    "Sweepa": "Warsect",
    "Chillet": "Elphidran",
    "Univolt": "Wumpo Botan",
    "Foxcicle": "Penking",
    "Pyrin": "Jormuntide",
    "Pyrin Noct": "Menasting",
    "Reindrix": "Anubis",
    "Rayhound": "Azurobe",
    "Kitsun": "Elphidran",
    "Dazzi": "Rayhound",
    "Lunaris": "Univolt",
    "Dinossom": "Elphidran",
    "Dinossom Lux": "Elphidran",
    "Surfent": "Nitewing",
    "Surfent Terra": "Sweepa",
    "Maraith": "Blazehowl",
    "Digtoise": "Surfent",
    "Tombat": "Grintale",
    "Lovander": "Incineram",
    "Flambelle": "Kitsun",
    "Vanwyrm": "Wumpo",
    "Vanwyrm Cryst": "Sibelyx",
    "Bushi": "Sibelyx",
    "Beakon": "Menasting",
    "Ragnahawk": "Reptyro",
    "Katress": "Wumpo Botan",
    "Wixen": "Blazehowl",
    "Verdash": "Bushi",
    "Vaelet": "Vanwyrm",
    "Sibelyx": "Pyrin",
    "Elphidran": "Sweepa",
    "Elphidran Aqua": "Sweepa",
    "Kelpsea": "Foxcicle",
    "Kelpsea Ignis": "Foxcicle",
    "Azurobe": "Ragnahawk",
    "Cryolinx": "Helzephyr",
    "Blazehowl": "Cinnamoth",
    "Blazehowl Noct": "Kingpaca",
    "Relaxaurus": "Relaxaurus",
    "Relaxaurus Lux": "Relaxaurus Lux",
    "Broncherry": "Anubis",
    "Broncherry Aqua": "Surfent",
    "Petallia": "Penking",
    "Reptyro": "Mammorest",
    "Ice Reptyro": "Menasting",
    "Kingpaca": "Pyrin",
    "Ice Kingpaca": "Pyrin",
    "Mammorest": "Relaxaurus",
    "Mammorest Cryst": "Relaxaurus",
    "Wumpo": "Pyrin",
    "Wumpo Botan": "Ragnahawk",
    "Warsect": "Jormuntide",
    "Fenglope": "Bushi",
    "Felbat": "Bushi",
    "Quivern": "Jormuntide",
    "Blazamut": "Cryolinx",
    "Helzephyr": "Beakon",
    "Astegon": "Beakon",
    "Menasting": "Menasting",
    "Anubis": "Nitewing",
    "Jormuntide": "Relaxaurus",
    "Jormuntide Ignis": "Mammorest",
    "Suzaku": "Astegon",
    "Suzaku Aqua": "Astegon",
    "Grizzbolt": "Beakon",
    "Lyleen": "Menasting",
    "Lyleen Noct": "Beakon",
    "Faleris": "Reptyro",
    "Orserk": "Beakon",
    "Shadowbeak": "Astegon",
    "Paladius": "Helzephyr",
    "Necromus": "Astegon",
    "Frostallion": "Helzephyr",
    "Frostallion Noct": "Helzephyr",
    "Jetragon": "Helzephyr"
  },
  "Broncherry": {
    "Lamball": "Wixen",
    "Cattiva": "Wixen",
    "Chikipi": "Nox",
    "Lifmunk": "Maraith",
    "Foxparks": "Rushoar",
    "Fuack": "Broncherry Aqua",
    "Sparkit": "Rushoar",
    "Tanzee": "Direhowl",
    "Rooby": "Felbat",
    "Pengullet": "Lunaris",
    "Penking": "Univolt",
    "Jolthog": "Lunaris",
    "Jolthog Cryst": "Lunaris",
    "Gumoss": "Vaelet",
    "Gumoss (Special)": "Vaelet",
    "Vixy": "Rooby",
    "Hoocrates": "Rushoar",
    "Teafant": "Nox",
    "Depresso": "Leezpunk",
    "Cremis": "Wixen",
    "Daedream": "Gorirat",
    "Rushoar": "Verdash",
    "Nox": "Robinquill",
    "Fuddler": "Gorirat",
    "Killamari": "Cawgnito",
    "Mau": "Wixen",
    "Mau Cryst": "Maraith",
    "Celaray": "Broncherry",
    "Direhowl": "Loupmoon",
    "Tocotoco": "Lunaris",
    "Flopie": "Beegarde",
    "Mozzarina": "Melpaca",
    "Bristla": "Gobfin",
    "Gobfin": "Fenglope",
    "Gobfin Ignis": "Fenglope",
    "Hangyu": "Rushoar",
    "Hangyu Cryst": "Maraith",
    "Mossanda": "Bushi",
    "Mossanda Lux": "Bushi",
    "Woolipop": "Galeclaw",
    "Caprity": "Dumud",
    "Melpaca": "Reindrix",
    "Eikthyrdeer": "Melpaca",
    "Eikthyrdeer Terra": "Reindrix",
    "Nitewing": "Bushi",
    "Ribunny": "Gobfin",
    "Incineram": "Rayhound",
    "Incineram Noct": "Blazehowl",
    "Cinnamoth": "Univolt",
    "Arsox": "Kitsun",
    "Dumud": "Reindrix",
    "Cawgnito": "Fenglope",
    "Leezpunk": "Verdash",
    "Leezpunk Ignis": "Felbat",
    "Loupmoon": "Mozzarina",
    "Galeclaw": "Loupmoon",
    "Robinquill": "Lovander",
    "Robinquill Terra": "Caprity",
    "Gorirat": "Loupmoon",
    "Beegarde": "Loupmoon",
    "Elizabee": "Incineram",
    "Grintale": "Univolt",
    "Swee": "Cawgnito",
    "Sweepa": "Bushi",
    "Chillet": "Kitsun",
    "Univolt": "Foxcicle",
    "Foxcicle": "Dinossom",
    "Pyrin": "Incineram",
    "Pyrin Noct": "Elphidran",
    "Reindrix": "Celaray",
    "Rayhound": "Chillet",
    "Kitsun": "Digtoise",
    "Dazzi": "Galeclaw",
    "Lunaris": "Fenglope",
    "Dinossom": "Digtoise",
    "Dinossom Lux": "Kitsun",
    "Surfent": "Blazehowl",
    "Surfent Terra": "Blazehowl",
    "Maraith": "Felbat",
    "Digtoise": "Digtoise",
    "Tombat": "Chillet",
    "Lovander": "Dumud",
    "Flambelle": "Rushoar",
    "Vanwyrm": "Foxcicle",
    "Vanwyrm Cryst": "Rayhound",
    "Bushi": "Tombat",
    "Beakon": "Elphidran",
    "Ragnahawk": "Bushi",
    "Katress": "Petallia",
    "Wixen": "Felbat",
    "Verdash": "Eikthyrdeer",
    "Vaelet": "Loupmoon",
    "Sibelyx": "Vanwyrm",
    "Elphidran": "Katress",
    "Elphidran Aqua": "Katress",
    "Kelpsea": "Direhowl",
    "Kelpsea Ignis": "Direhowl",
    "Azurobe": "Univolt",
    "Cryolinx": "Azurobe",
    "Blazehowl": "Arsox",
    "Blazehowl Noct": "Foxcicle",
    "Relaxaurus": "Anubis",
    "Relaxaurus Lux": "Anubis",
    "Broncherry": "Broncherry",
    "Broncherry Aqua": "Digtoise",
    "Petallia": "Dinossom",
    "Reptyro": "Incineram",
    "Ice Reptyro": "Elphidran",
    "Kingpaca": "Vanwyrm",
    "Ice Kingpaca": "Vanwyrm",
    "Mammorest": "Anubis",
    "Mammorest Cryst": "Anubis",
    "Wumpo": "Vanwyrm",
    "Wumpo Botan": "Univolt",
    "Warsect": "Incineram",
    "Fenglope": "Eikthyrdeer",
    "Felbat": "Caprity",
    "Quivern": "Incineram",
    "Blazamut": "Mossanda",
    "Helzephyr": "Penking",
    "Astegon": "Azurobe",
    "Menasting": "Surfent",
    "Anubis": "Blazehowl",
    "Jormuntide": "Incineram",
    "Jormuntide Ignis": "Incineram",
    "Suzaku": "Sibelyx",
    "Suzaku Aqua": "Sibelyx",
    "Grizzbolt": "Elphidran",
    "Lyleen": "Surfent",
    "Lyleen Noct": "Elphidran",
    "Faleris": "Incineram",
    "Orserk": "Azurobe",
    "Shadowbeak": "Wumpo",
    "Paladius": "Kingpaca",
    "Necromus": "Wumpo",
    "Frostallion": "Cinnamoth",
    "Frostallion Noct": "Wumpo Botan",
    "Jetragon": "Wumpo Botan"
  },
  "Broncherry Aqua": {
    "variant": true,
    "Lamball": "Rooby",
    "Cattiva": "Maraith",
    "Chikipi": "Wixen",
    "Lifmunk": "Rushoar",
    "Foxparks": "Leezpunk",
    "Fuack": "Gobfin",
    "Sparkit": "Rushoar",
    "Tanzee": "Gorirat",
    "Rooby": "Verdash",
    "Pengullet": "Gobfin",
    "Penking": "Univolt",
    "Jolthog": "Lunaris",
    "Jolthog Cryst": "Lunaris",
    "Gumoss": "Gorirat",
    "Gumoss (Special)": "Gorirat",
    "Vixy": "Maraith",
    "Hoocrates": "Lunaris",
    "Teafant": "Wixen",
    "Depresso": "Lunaris",
    "Cremis": "Maraith",
    "Daedream": "Galeclaw",
    "Rushoar": "Fenglope",
    "Nox": "Felbat",
    "Fuddler": "Galeclaw",
    "Killamari": "Direhowl",
    "Mau": "Wixen",
    "Mau Cryst": "Rushoar",
    "Celaray": "Digtoise",
    "Direhowl": "Loupmoon",
    "Tocotoco": "Gobfin",
    "Flopie": "Direhowl",
    "Mozzarina": "Reindrix",
    "Bristla": "Cawgnito",
    "Gobfin": "Loupmoon",
    "Gobfin Ignis": "Fenglope",
    "Hangyu": "Rushoar",
    "Hangyu Cryst": "Rushoar",
    "Mossanda": "Bushi",
    "Mossanda Lux": "Incineram",
    "Woolipop": "Robinquill",
    "Caprity": "Melpaca",
    "Melpaca": "Broncherry",
    "Eikthyrdeer": "Reindrix",
    "Eikthyrdeer Terra": "Celaray",
    "Nitewing": "Bushi",
    "Ribunny": "Cawgnito",
    "Incineram": "Blazehowl",
    "Incineram Noct": "Blazehowl",
    "Cinnamoth": "Vanwyrm",
    "Arsox": "Dinossom",
    "Dumud": "Celaray",
    "Cawgnito": "Loupmoon",
    "Leezpunk": "Fenglope",
    "Leezpunk Ignis": "Verdash",
    "Loupmoon": "Dumud",
    "Galeclaw": "Caprity",
    "Robinquill": "Caprity",
    "Robinquill Terra": "Eikthyrdeer",
    "Gorirat": "Lovander",
    "Beegarde": "Loupmoon",
    "Elizabee": "Incineram",
    "Grintale": "Univolt",
    "Swee": "Beegarde",
    "Sweepa": "Bushi",
    "Chillet": "Dinossom",
    "Univolt": "Foxcicle",
    "Foxcicle": "Chillet",
    "Pyrin": "Incineram",
    "Pyrin Noct": "Elphidran",
    "Reindrix": "Broncherry",
    "Rayhound": "Arsox",
    "Kitsun": "Kitsun",
    "Dazzi": "Galeclaw",
    "Lunaris": "Fenglope",
    "Dinossom": "Kitsun",
    "Dinossom Lux": "Kitsun",
    "Surfent": "Katress",
    "Surfent Terra": "Katress",
    "Maraith": "Verdash",
    "Digtoise": "Digtoise",
    "Tombat": "Arsox",
    "Lovander": "Melpaca",
    "Flambelle": "Leezpunk",
    "Vanwyrm": "Tombat",
    "Vanwyrm Cryst": "Rayhound",
    "Bushi": "Rayhound",
    "Beakon": "Elphidran",
    "Ragnahawk": "Incineram",
    "Katress": "Foxcicle",
    "Wixen": "Felbat",
    "Verdash": "Eikthyrdeer",
    "Vaelet": "Loupmoon",
    "Sibelyx": "Bushi",
    "Elphidran": "Univolt",
    "Elphidran Aqua": "Univolt",
    "Kelpsea": "Vaelet",
    "Kelpsea Ignis": "Direhowl",
    "Azurobe": "Univolt",
    "Cryolinx": "Wumpo Botan",
    "Blazehowl": "Petallia",
    "Blazehowl Noct": "Tombat",
    "Relaxaurus": "Surfent",
    "Relaxaurus Lux": "Surfent",
    "Broncherry": "Digtoise",
    "Broncherry Aqua": "Broncherry Aqua",
    "Petallia": "Dinossom",
    "Reptyro": "Anubis",
    "Ice Reptyro": "Elphidran",
    "Kingpaca": "Vanwyrm",
    "Ice Kingpaca": "Bushi",
    "Mammorest": "Anubis",
    "Mammorest Cryst": "Anubis",
    "Wumpo": "Vanwyrm",
    "Wumpo Botan": "Vanwyrm",
    "Warsect": "Incineram",
    "Fenglope": "Mozzarina",
    "Felbat": "Eikthyrdeer",
    "Quivern": "Incineram",
    "Blazamut": "Nitewing",
    "Helzephyr": "Penking",
    "Astegon": "Azurobe",
    "Menasting": "Elphidran",
    "Anubis": "Blazehowl",
    "Jormuntide": "Anubis",
    "Jormuntide Ignis": "Anubis",
    "Suzaku": "Sibelyx",
    "Suzaku Aqua": "Mossanda",
    "Grizzbolt": "Penking",
    "Lyleen": "Elphidran",
    "Lyleen Noct": "Penking",
    "Faleris": "Incineram",
    "Orserk": "Cinnamoth",
    "Shadowbeak": "Sibelyx",
    "Paladius": "Wumpo",
    "Necromus": "Sibelyx",
    "Frostallion": "Wumpo Botan",
    "Frostallion Noct": "Kingpaca",
    "Jetragon": "Wumpo"
  },
  "Petallia": {
    "Lamball": "Rushoar",
    "Cattiva": "Leezpunk",
    "Chikipi": "Rushoar",
    "Lifmunk": "Lunaris",
    "Foxparks": "Gobfin",
    "Fuack": "Direhowl",
    "Sparkit": "Gobfin",
    "Tanzee": "Robinquill",
    "Rooby": "Fenglope",
    "Pengullet": "Direhowl",
    "Penking": "Vanwyrm",
    "Jolthog": "Cawgnito",
    "Jolthog Cryst": "Beegarde",
    "Gumoss": "Felbat",
    "Gumoss (Special)": "Felbat",
    "Vixy": "Lunaris",
    "Hoocrates": "Gobfin",
    "Teafant": "Rushoar",
    "Depresso": "Cawgnito",
    "Cremis": "Leezpunk",
    "Daedream": "Felbat",
    "Rushoar": "Loupmoon",
    "Nox": "Fenglope",
    "Fuddler": "Felbat",
    "Killamari": "Galeclaw",
    "Mau": "Rushoar",
    "Mau Cryst": "Lunaris",
    "Celaray": "Kitsun",
    "Direhowl": "Eikthyrdeer",
    "Tocotoco": "Direhowl",
    "Flopie": "Galeclaw",
    "Mozzarina": "Digtoise",
    "Bristla": "Vaelet",
    "Gobfin": "Caprity",
    "Gobfin Ignis": "Lovander",
    "Hangyu": "Lunaris",
    "Hangyu Cryst": "Lunaris",
    "Mossanda": "Lyleen",
    "Mossanda Lux": "Incineram",
    "Woolipop": "Fenglope",
    "Caprity": "Digtoise",
    "Melpaca": "Kitsun",
    "Eikthyrdeer": "Digtoise",
    "Eikthyrdeer Terra": "Digtoise",
    "Nitewing": "Incineram",
    "Ribunny": "Gorirat",
    "Incineram": "Univolt",
    "Incineram Noct": "Univolt",
    "Cinnamoth": "Bushi",
    "Arsox": "Arsox",
    "Dumud": "Kitsun",
    "Cawgnito": "Caprity",
    "Leezpunk": "Loupmoon",
    "Leezpunk Ignis": "Loupmoon",
    "Loupmoon": "Broncherry",
    "Galeclaw": "Mozzarina",
    "Robinquill": "Dumud",
    "Robinquill Terra": "Melpaca",
    "Gorirat": "Mozzarina",
    "Beegarde": "Eikthyrdeer",
    "Elizabee": "Surfent",
    "Grintale": "Bushi",
    "Swee": "Gorirat",
    "Sweepa": "Incineram",
    "Chillet": "Arsox",
    "Univolt": "Rayhound",
    "Foxcicle": "Foxcicle",
    "Pyrin": "Anubis",
    "Pyrin Noct": "Grintale",
    "Reindrix": "Kitsun",
    "Rayhound": "Foxcicle",
    "Kitsun": "Chillet",
    "Dazzi": "Verdash",
    "Lunaris": "Loupmoon",
    "Dinossom": "Chillet",
    "Dinossom Lux": "Arsox",
    "Surfent": "Univolt",
    "Surfent Terra": "Vanwyrm",
    "Maraith": "Loupmoon",
    "Digtoise": "Dinossom",
    "Tombat": "Foxcicle",
    "Lovander": "Broncherry",
    "Flambelle": "Gobfin",
    "Vanwyrm": "Blazehowl",
    "Vanwyrm Cryst": "Katress",
    "Bushi": "Blazehowl",
    "Beakon": "Azurobe",
    "Ragnahawk": "Anubis",
    "Katress": "Rayhound",
    "Wixen": "Fenglope",
    "Verdash": "Melpaca",
    "Vaelet": "Eikthyrdeer",
    "Sibelyx": "Incineram",
    "Elphidran": "Vanwyrm",
    "Elphidran Aqua": "Vanwyrm",
    "Kelpsea": "Robinquill",
    "Kelpsea Ignis": "Galeclaw",
    "Azurobe": "Bushi",
    "Cryolinx": "Sibelyx",
    "Blazehowl": "Tombat",
    "Blazehowl Noct": "Rayhound",
    "Relaxaurus": "Elphidran",
    "Relaxaurus Lux": "Penking",
    "Broncherry": "Dinossom",
    "Broncherry Aqua": "Dinossom",
    "Petallia": "Petallia",
    "Reptyro": "Elphidran",
    "Ice Reptyro": "Azurobe",
    "Kingpaca": "Bushi",
    "Ice Kingpaca": "Incineram",
    "Mammorest": "Elphidran",
    "Mammorest Cryst": "Elphidran",
    "Wumpo": "Bushi",
    "Wumpo Botan": "Bushi",
    "Warsect": "Surfent",
    "Fenglope": "Reindrix",
    "Felbat": "Dumud",
    "Quivern": "Anubis",
    "Blazamut": "Sweepa",
    "Helzephyr": "Wumpo Botan",
    "Astegon": "Wumpo",
    "Menasting": "Penking",
    "Anubis": "Univolt",
    "Jormuntide": "Elphidran",
    "Jormuntide Ignis": "Elphidran",
    "Suzaku": "Nitewing",
    "Suzaku Aqua": "Sweepa",
    "Grizzbolt": "Cinnamoth",
    "Lyleen": "Penking",
    "Lyleen Noct": "Azurobe",
    "Faleris": "Anubis",
    "Orserk": "Wumpo",
    "Shadowbeak": "Nitewing",
    "Paladius": "Mossanda",
    "Necromus": "Nitewing",
    "Frostallion": "Sibelyx",
    "Frostallion Noct": "Sibelyx",
    "Jetragon": "Mossanda"
  },
  "Reptyro": {
    "Lamball": "Dumud",
    "Cattiva": "Melpaca",
    "Chikipi": "Mozzarina",
    "Lifmunk": "Reindrix",
    "Foxparks": "Broncherry",
    "Fuack": "Kitsun",
    "Sparkit": "Broncherry",
    "Tanzee": "Arsox",
    "Rooby": "Rayhound",
    "Pengullet": "Kitsun",
    "Penking": "Nitewing",
    "Jolthog": "Digtoise",
    "Jolthog Cryst": "Digtoise",
    "Gumoss": "Petallia",
    "Gumoss (Special)": "Petallia",
    "Vixy": "Melpaca",
    "Hoocrates": "Digtoise",
    "Teafant": "Mozzarina",
    "Depresso": "Digtoise",
    "Cremis": "Melpaca",
    "Daedream": "Petallia",
    "Rushoar": "Rayhound",
    "Nox": "Tombat",
    "Fuddler": "Foxcicle",
    "Killamari": "Chillet",
    "Mau": "Dumud",
    "Mau Cryst": "Reindrix",
    "Celaray": "Incineram",
    "Direhowl": "Univolt",
    "Tocotoco": "Kitsun",
    "Flopie": "Chillet",
    "Mozzarina": "Incineram",
    "Bristla": "Dinossom",
    "Gobfin": "Blazehowl",
    "Gobfin Ignis": "Blazehowl",
    "Hangyu": "Celaray",
    "Hangyu Cryst": "Celaray",
    "Mossanda": "Ragnahawk",
    "Mossanda Lux": "Pyrin",
    "Woolipop": "Tombat",
    "Caprity": "Bushi",
    "Melpaca": "Incineram",
    "Eikthyrdeer": "Bushi",
    "Eikthyrdeer Terra": "Incineram",
    "Nitewing": "Pyrin",
    "Ribunny": "Dinossom",
    "Incineram": "Sibelyx",
    "Incineram Noct": "Sibelyx",
    "Cinnamoth": "Sweepa",
    "Arsox": "Surfent",
    "Dumud": "Incineram",
    "Cawgnito": "Katress",
    "Leezpunk": "Blazehowl",
    "Leezpunk Ignis": "Rayhound",
    "Loupmoon": "Bushi",
    "Galeclaw": "Univolt",
    "Robinquill": "Univolt",
    "Robinquill Terra": "Vanwyrm",
    "Gorirat": "Univolt",
    "Beegarde": "Katress",
    "Elizabee": "Reptyro",
    "Grintale": "Nitewing",
    "Swee": "Dinossom",
    "Sweepa": "Pyrin",
    "Chillet": "Surfent",
    "Univolt": "Azurobe",
    "Foxcicle": "Ice Reptyro",
    "Pyrin": "Warsect",
    "Pyrin Noct": "Relaxaurus",
    "Reindrix": "Incineram",
    "Rayhound": "Elphidran",
    "Kitsun": "Anubis",
    "Dazzi": "Foxcicle",
    "Lunaris": "Blazehowl",
    "Dinossom": "Anubis",
    "Dinossom Lux": "Anubis",
    "Surfent": "Sibelyx",
    "Surfent Terra": "Mossanda",
    "Maraith": "Rayhound",
    "Digtoise": "Incineram",
    "Tombat": "Elphidran",
    "Lovander": "Bushi",
    "Flambelle": "Broncherry",
    "Vanwyrm": "Cinnamoth",
    "Vanwyrm Cryst": "Kingpaca",
    "Bushi": "Wumpo Botan",
    "Beakon": "Relaxaurus",
    "Ragnahawk": "Quivern",
    "Katress": "Grintale",
    "Wixen": "Rayhound",
    "Verdash": "Vanwyrm",
    "Vaelet": "Univolt",
    "Sibelyx": "Ragnahawk",
    "Elphidran": "Mossanda",
    "Elphidran Aqua": "Nitewing",
    "Kelpsea": "Arsox",
    "Kelpsea Ignis": "Arsox",
    "Azurobe": "Sweepa",
    "Cryolinx": "Beakon",
    "Blazehowl": "Penking",
    "Blazehowl Noct": "Azurobe",
    "Relaxaurus": "Mammorest",
    "Relaxaurus Lux": "Mammorest",
    "Broncherry": "Incineram",
    "Broncherry Aqua": "Anubis",
    "Petallia": "Elphidran",
    "Reptyro": "Reptyro",
    "Ice Reptyro": "Relaxaurus",
    "Kingpaca": "Sweepa",
    "Ice Kingpaca": "Ragnahawk",
    "Mammorest": "Jormuntide",
    "Mammorest Cryst": "Jormuntide",
    "Wumpo": "Ragnahawk",
    "Wumpo Botan": "Sweepa",
    "Warsect": "Elizabee",
    "Fenglope": "Vanwyrm",
    "Felbat": "Vanwyrm",
    "Quivern": "Elizabee",
    "Blazamut": "Astegon",
    "Helzephyr": "Menasting",
    "Astegon": "Beakon",
    "Menasting": "Relaxaurus",
    "Anubis": "Sibelyx",
    "Jormuntide": "Jormuntide",
    "Jormuntide Ignis": "Reptyro",
    "Suzaku": "Helzephyr",
    "Suzaku Aqua": "Helzephyr",
    "Grizzbolt": "Menasting",
    "Lyleen": "Relaxaurus",
    "Lyleen Noct": "Menasting",
    "Faleris": "Warsect",
    "Orserk": "Beakon",
    "Shadowbeak": "Helzephyr",
    "Paladius": "Helzephyr",
    "Necromus": "Helzephyr",
    "Frostallion": "Beakon",
    "Frostallion Noct": "Beakon",
    "Jetragon": "Beakon"
  },
  "Ice Reptyro": {
    "variant": true,
    "Lamball": "Digtoise",
    "Cattiva": "Digtoise",
    "Chikipi": "Broncherry",
    "Lifmunk": "Kitsun",
    "Foxparks": "Dinossom",
    "Fuack": "Petallia",
    "Sparkit": "Dinossom",
    "Tanzee": "Rayhound",
    "Rooby": "Katress",
    "Pengullet": "Arsox",
    "Penking": "Ragnahawk",
    "Jolthog": "Chillet",
    "Jolthog Cryst": "Arsox",
    "Gumoss": "Rayhound",
    "Gumoss (Special)": "Rayhound",
    "Vixy": "Digtoise",
    "Hoocrates": "Dinossom",
    "Teafant": "Broncherry",
    "Depresso": "Chillet",
    "Cremis": "Digtoise",
    "Daedream": "Rayhound",
    "Rushoar": "Univolt",
    "Nox": "Blazehowl",
    "Fuddler": "Rayhound",
    "Killamari": "Foxcicle",
    "Mau": "Digtoise",
    "Mau Cryst": "Kitsun",
    "Celaray": "Elphidran",
    "Direhowl": "Bushi",
    "Tocotoco": "Arsox",
    "Flopie": "Tombat",
    "Mozzarina": "Anubis",
    "Bristla": "Petallia",
    "Gobfin": "Vanwyrm",
    "Gobfin Ignis": "Vanwyrm",
    "Hangyu": "Kitsun",
    "Hangyu Cryst": "Kitsun",
    "Mossanda": "Elizabee",
    "Mossanda Lux": "Jormuntide",
    "Woolipop": "Blazehowl",
    "Caprity": "Anubis",
    "Melpaca": "Surfent",
    "Eikthyrdeer": "Anubis",
    "Eikthyrdeer Terra": "Anubis",
    "Nitewing": "Reptyro",
    "Ribunny": "Foxcicle",
    "Incineram": "Sweepa",
    "Incineram Noct": "Sweepa",
    "Cinnamoth": "Pyrin",
    "Arsox": "Grintale",
    "Dumud": "Surfent",
    "Cawgnito": "Vanwyrm",
    "Leezpunk": "Univolt",
    "Leezpunk Ignis": "Univolt",
    "Loupmoon": "Incineram",
    "Galeclaw": "Bushi",
    "Robinquill": "Bushi",
    "Robinquill Terra": "Incineram",
    "Gorirat": "Bushi",
    "Beegarde": "Vanwyrm",
    "Elizabee": "Relaxaurus",
    "Grintale": "Pyrin",
    "Swee": "Foxcicle",
    "Sweepa": "Reptyro",
    "Chillet": "Penking",
    "Univolt": "Sibelyx",
    "Foxcicle": "Azurobe",
    "Pyrin": "Mammorest",
    "Pyrin Noct": "Beakon",
    "Reindrix": "Surfent",
    "Rayhound": "Wumpo Botan",
    "Kitsun": "Elphidran",
    "Dazzi": "Blazehowl",
    "Lunaris": "Univolt",
    "Dinossom": "Penking",
    "Dinossom Lux": "Penking",
    "Surfent": "Sweepa",
    "Surfent Terra": "Ragnahawk",
    "Maraith": "Univolt",
    "Digtoise": "Elphidran",
    "Tombat": "Cinnamoth",
    "Lovander": "Incineram",
    "Flambelle": "Dinossom",
    "Vanwyrm": "Sibelyx",
    "Vanwyrm Cryst": "Nitewing",
    "Bushi": "Mossanda",
    "Beakon": "Beakon",
    "Ragnahawk": "Jormuntide",
    "Katress": "Wumpo",
    "Wixen": "Katress",
    "Verdash": "Incineram",
    "Vaelet": "Bushi",
    "Sibelyx": "Warsect",
    "Elphidran": "Ragnahawk",
    "Elphidran Aqua": "Ragnahawk",
    "Kelpsea": "Tombat",
    "Kelpsea Ignis": "Tombat",
    "Azurobe": "Pyrin",
    "Cryolinx": "Helzephyr",
    "Blazehowl": "Kingpaca",
    "Blazehowl Noct": "Sibelyx",
    "Relaxaurus": "Menasting",
    "Relaxaurus Lux": "Menasting",
    "Broncherry": "Elphidran",
    "Broncherry Aqua": "Elphidran",
    "Petallia": "Azurobe",
    "Reptyro": "Relaxaurus",
    "Ice Reptyro": "Ice Reptyro",
    "Kingpaca": "Quivern",
    "Ice Kingpaca": "Elizabee",
    "Mammorest": "Menasting",
    "Mammorest Cryst": "Menasting",
    "Wumpo": "Warsect",
    "Wumpo Botan": "Pyrin",
    "Warsect": "Relaxaurus",
    "Fenglope": "Incineram",
    "Felbat": "Bushi",
    "Quivern": "Relaxaurus",
    "Blazamut": "Cryolinx",
    "Helzephyr": "Beakon",
    "Astegon": "Helzephyr",
    "Menasting": "Menasting",
    "Anubis": "Sweepa",
    "Jormuntide": "Relaxaurus",
    "Jormuntide Ignis": "Relaxaurus",
    "Suzaku": "Cryolinx",
    "Suzaku Aqua": "Cryolinx",
    "Grizzbolt": "Beakon",
    "Lyleen": "Beakon",
    "Lyleen Noct": "Beakon",
    "Faleris": "Mammorest",
    "Orserk": "Helzephyr",
    "Shadowbeak": "Astegon",
    "Paladius": "Astegon",
    "Necromus": "Astegon",
    "Frostallion": "Helzephyr",
    "Frostallion Noct": "Astegon",
    "Jetragon": "Astegon"
  },
  "Kingpaca": {
    "Lamball": "Fenglope",
    "Cattiva": "Loupmoon",
    "Chikipi": "Fenglope",
    "Lifmunk": "Loupmoon",
    "Foxparks": "Caprity",
    "Fuack": "Dumud",
    "Sparkit": "Lovander",
    "Tanzee": "Broncherry",
    "Rooby": "Dinossom",
    "Pengullet": "Mozzarina",
    "Penking": "Azurobe",
    "Jolthog": "Eikthyrdeer",
    "Jolthog Cryst": "Eikthyrdeer",
    "Gumoss": "Digtoise",
    "Gumoss (Special)": "Digtoise",
    "Vixy": "Loupmoon",
    "Hoocrates": "Caprity",
    "Teafant": "Fenglope",
    "Depresso": "Eikthyrdeer",
    "Cremis": "Loupmoon",
    "Daedream": "Digtoise",
    "Rushoar": "Chillet",
    "Nox": "Kitsun",
    "Fuddler": "Digtoise",
    "Killamari": "Reindrix",
    "Mau": "Fenglope",
    "Mau Cryst": "Loupmoon",
    "Celaray": "Univolt",
    "Direhowl": "Foxcicle",
    "Tocotoco": "Mozzarina",
    "Flopie": "Reindrix",
    "Mozzarina": "Univolt",
    "Bristla": "Dumud",
    "Gobfin": "Petallia",
    "Gobfin Ignis": "Arsox",
    "Hangyu": "Loupmoon",
    "Hangyu Cryst": "Loupmoon",
    "Mossanda": "Sibelyx",
    "Mossanda Lux": "Mossanda",
    "Woolipop": "Kitsun",
    "Caprity": "Katress",
    "Melpaca": "Univolt",
    "Eikthyrdeer": "Katress",
    "Eikthyrdeer Terra": "Univolt",
    "Nitewing": "Sibelyx",
    "Ribunny": "Melpaca",
    "Incineram": "Elphidran",
    "Incineram Noct": "Penking",
    "Cinnamoth": "Wumpo Botan",
    "Arsox": "Bushi",
    "Dumud": "Univolt",
    "Cawgnito": "Petallia",
    "Leezpunk": "Arsox",
    "Leezpunk Ignis": "Chillet",
    "Loupmoon": "Blazehowl",
    "Galeclaw": "Tombat",
    "Robinquill": "Tombat",
    "Robinquill Terra": "Rayhound",
    "Gorirat": "Tombat",
    "Beegarde": "Foxcicle",
    "Elizabee": "Sweepa",
    "Grintale": "Cinnamoth",
    "Swee": "Melpaca",
    "Sweepa": "Sibelyx",
    "Chillet": "Bushi",
    "Univolt": "Anubis",
    "Foxcicle": "Incineram",
    "Pyrin": "Nitewing",
    "Pyrin Noct": "Pyrin",
    "Reindrix": "Ice Kingpaca",
    "Rayhound": "Incineram",
    "Kitsun": "Vanwyrm",
    "Dazzi": "Digtoise",
    "Lunaris": "Arsox",
    "Dinossom": "Bushi",
    "Dinossom Lux": "Bushi",
    "Surfent": "Penking",
    "Surfent Terra": "Grintale",
    "Maraith": "Dinossom",
    "Digtoise": "Vanwyrm",
    "Tombat": "Incineram",
    "Lovander": "Blazehowl",
    "Flambelle": "Lovander",
    "Vanwyrm": "Anubis",
    "Vanwyrm Cryst": "Elphidran",
    "Bushi": "Surfent",
    "Beakon": "Warsect",
    "Ragnahawk": "Nitewing",
    "Katress": "Incineram",
    "Wixen": "Dinossom",
    "Verdash": "Rayhound",
    "Vaelet": "Foxcicle",
    "Sibelyx": "Wumpo",
    "Elphidran": "Azurobe",
    "Elphidran Aqua": "Azurobe",
    "Kelpsea": "Broncherry",
    "Kelpsea Ignis": "Celaray",
    "Azurobe": "Wumpo Botan",
    "Cryolinx": "Mammorest",
    "Blazehowl": "Incineram",
    "Blazehowl Noct": "Anubis",
    "Relaxaurus": "Ragnahawk",
    "Relaxaurus Lux": "Pyrin",
    "Broncherry": "Vanwyrm",
    "Broncherry Aqua": "Vanwyrm",
    "Petallia": "Bushi",
    "Reptyro": "Sweepa",
    "Ice Reptyro": "Quivern",
    "Kingpaca": "Kingpaca",
    "Ice Kingpaca": "Sibelyx",
    "Mammorest": "Ragnahawk",
    "Mammorest Cryst": "Ragnahawk",
    "Wumpo": "Wumpo",
    "Wumpo Botan": "Wumpo Botan",
    "Warsect": "Sweepa",
    "Fenglope": "Rayhound",
    "Felbat": "Rayhound",
    "Quivern": "Sweepa",
    "Blazamut": "Beakon",
    "Helzephyr": "Elizabee",
    "Astegon": "Jormuntide",
    "Menasting": "Pyrin",
    "Anubis": "Penking",
    "Jormuntide": "Ragnahawk",
    "Jormuntide Ignis": "Ragnahawk",
    "Suzaku": "Menasting",
    "Suzaku Aqua": "Menasting",
    "Grizzbolt": "Elizabee",
    "Lyleen": "Pyrin",
    "Lyleen Noct": "Warsect",
    "Faleris": "Nitewing",
    "Orserk": "Jormuntide",
    "Shadowbeak": "Menasting",
    "Paladius": "Relaxaurus",
    "Necromus": "Relaxaurus",
    "Frostallion": "Mammorest",
    "Frostallion Noct": "Relaxaurus",
    "Jetragon": "Relaxaurus"
  },
  "Ice Kingpaca": {
    "variant": true,
    "Lamball": "Loupmoon",
    "Cattiva": "Loupmoon",
    "Chikipi": "Fenglope",
    "Lifmunk": "Caprity",
    "Foxparks": "Eikthyrdeer",
    "Fuack": "Melpaca",
    "Sparkit": "Eikthyrdeer",
    "Tanzee": "Digtoise",
    "Rooby": "Chillet",
    "Pengullet": "Dumud",
    "Penking": "Wumpo Botan",
    "Jolthog": "Mozzarina",
    "Jolthog Cryst": "Dumud",
    "Gumoss": "Digtoise",
    "Gumoss (Special)": "Digtoise",
    "Vixy": "Loupmoon",
    "Hoocrates": "Eikthyrdeer",
    "Teafant": "Loupmoon",
    "Depresso": "Mozzarina",
    "Cremis": "Loupmoon",
    "Daedream": "Kitsun",
    "Rushoar": "Arsox",
    "Nox": "Dinossom",
    "Fuddler": "Kitsun",
    "Killamari": "Broncherry",
    "Mau": "Loupmoon",
    "Mau Cryst": "Lovander",
    "Celaray": "Vanwyrm",
    "Direhowl": "Tombat",
    "Tocotoco": "Melpaca",
    "Flopie": "Broncherry",
    "Mozzarina": "Univolt",
    "Bristla": "Reindrix",
    "Gobfin": "Foxcicle",
    "Gobfin Ignis": "Foxcicle",
    "Hangyu": "Caprity",
    "Hangyu Cryst": "Caprity",
    "Mossanda": "Mossanda",
    "Mossanda Lux": "Nitewing",
    "Woolipop": "Dinossom",
    "Caprity": "Univolt",
    "Melpaca": "Vanwyrm",
    "Eikthyrdeer": "Univolt",
    "Eikthyrdeer Terra": "Univolt",
    "Nitewing": "Mossanda",
    "Ribunny": "Reindrix",
    "Incineram": "Penking",
    "Incineram Noct": "Grintale",
    "Cinnamoth": "Wumpo",
    "Arsox": "Incineram",
    "Dumud": "Vanwyrm",
    "Cawgnito": "Foxcicle",
    "Leezpunk": "Petallia",
    "Leezpunk Ignis": "Arsox",
    "Loupmoon": "Katress",
    "Galeclaw": "Rayhound",
    "Robinquill": "Rayhound",
    "Robinquill Terra": "Blazehowl",
    "Gorirat": "Rayhound",
    "Beegarde": "Tombat",
    "Elizabee": "Ragnahawk",
    "Grintale": "Wumpo Botan",
    "Swee": "Celaray",
    "Sweepa": "Nitewing",
    "Chillet": "Bushi",
    "Univolt": "Surfent",
    "Foxcicle": "Incineram",
    "Pyrin": "Sweepa",
    "Pyrin Noct": "Warsect",
    "Reindrix": "Vanwyrm",
    "Rayhound": "Incineram",
    "Kitsun": "Bushi",
    "Dazzi": "Kitsun",
    "Lunaris": "Petallia",
    "Dinossom": "Bushi",
    "Dinossom Lux": "Bushi",
    "Surfent": "Azurobe",
    "Surfent Terra": "Azurobe",
    "Maraith": "Arsox",
    "Digtoise": "Bushi",
    "Tombat": "Incineram",
    "Lovander": "Univolt",
    "Flambelle": "Eikthyrdeer",
    "Vanwyrm": "Elphidran",
    "Vanwyrm Cryst": "Elphidran",
    "Bushi": "Elphidran",
    "Beakon": "Elizabee",
    "Ragnahawk": "Sweepa",
    "Katress": "Anubis",
    "Wixen": "Chillet",
    "Verdash": "Blazehowl",
    "Vaelet": "Tombat",
    "Sibelyx": "Sibelyx",
    "Elphidran": "Cinnamoth",
    "Elphidran Aqua": "Wumpo Botan",
    "Kelpsea": "Digtoise",
    "Kelpsea Ignis": "Digtoise",
    "Azurobe": "Kingpaca",
    "Cryolinx": "Relaxaurus",
    "Blazehowl": "Anubis",
    "Blazehowl Noct": "Surfent",
    "Relaxaurus": "Pyrin",
    "Relaxaurus Lux": "Pyrin",
    "Broncherry": "Vanwyrm",
    "Broncherry Aqua": "Bushi",
    "Petallia": "Incineram",
    "Reptyro": "Ragnahawk",
    "Ice Reptyro": "Elizabee",
    "Kingpaca": "Sibelyx",
    "Ice Kingpaca": "Ice Kingpaca",
    "Mammorest": "Pyrin",
    "Mammorest Cryst": "Pyrin",
    "Wumpo": "Sibelyx",
    "Wumpo Botan": "Wumpo",
    "Warsect": "Ragnahawk",
    "Fenglope": "Blazehowl",
    "Felbat": "Rayhound",
    "Quivern": "Sweepa",
    "Blazamut": "Beakon",
    "Helzephyr": "Jormuntide",
    "Astegon": "Mammorest",
    "Menasting": "Quivern",
    "Anubis": "Azurobe",
    "Jormuntide": "Ragnahawk",
    "Jormuntide Ignis": "Ragnahawk",
    "Suzaku": "Menasting",
    "Suzaku Aqua": "Beakon",
    "Grizzbolt": "Reptyro",
    "Lyleen": "Warsect",
    "Lyleen Noct": "Reptyro",
    "Faleris": "Sweepa",
    "Orserk": "Relaxaurus",
    "Shadowbeak": "Menasting",
    "Paladius": "Menasting",
    "Necromus": "Menasting",
    "Frostallion": "Relaxaurus",
    "Frostallion Noct": "Relaxaurus",
    "Jetragon": "Menasting"
  },
  "Mammorest": {
    "Lamball": "Melpaca",
    "Cattiva": "Reindrix",
    "Chikipi": "Dumud",
    "Lifmunk": "Broncherry",
    "Foxparks": "Digtoise",
    "Fuack": "Dinossom",
    "Sparkit": "Digtoise",
    "Tanzee": "Petallia",
    "Rooby": "Rayhound",
    "Pengullet": "Kitsun",
    "Penking": "Sweepa",
    "Jolthog": "Kitsun",
    "Jolthog Cryst": "Kitsun",
    "Gumoss": "Foxcicle",
    "Gumoss (Special)": "Foxcicle",
    "Vixy": "Reindrix",
    "Hoocrates": "Digtoise",
    "Teafant": "Dumud",
    "Depresso": "Digtoise",
    "Cremis": "Reindrix",
    "Daedream": "Foxcicle",
    "Rushoar": "Blazehowl",
    "Nox": "Rayhound",
    "Fuddler": "Foxcicle",
    "Killamari": "Arsox",
    "Mau": "Melpaca",
    "Mau Cryst": "Celaray",
    "Celaray": "Incineram",
    "Direhowl": "Univolt",
    "Tocotoco": "Dinossom",
    "Flopie": "Arsox",
    "Mozzarina": "Incineram",
    "Bristla": "Dinossom",
    "Gobfin": "Katress",
    "Gobfin Ignis": "Katress",
    "Hangyu": "Broncherry",
    "Hangyu Cryst": "Broncherry",
    "Mossanda": "Pyrin",
    "Mossanda Lux": "Warsect",
    "Woolipop": "Tombat",
    "Caprity": "Incineram",
    "Melpaca": "Incineram",
    "Eikthyrdeer": "Incineram",
    "Eikthyrdeer Terra": "Incineram",
    "Nitewing": "Pyrin",
    "Ribunny": "Chillet",
    "Incineram": "Sibelyx",
    "Incineram Noct": "Sibelyx",
    "Cinnamoth": "Sweepa",
    "Arsox": "Elphidran",
    "Dumud": "Incineram",
    "Cawgnito": "Univolt",
    "Leezpunk": "Blazehowl",
    "Leezpunk Ignis": "Blazehowl",
    "Loupmoon": "Bushi",
    "Galeclaw": "Vanwyrm",
    "Robinquill": "Vanwyrm",
    "Robinquill Terra": "Vanwyrm",
    "Gorirat": "Univolt",
    "Beegarde": "Univolt",
    "Elizabee": "Jormuntide",
    "Grintale": "Sweepa",
    "Swee": "Chillet",
    "Sweepa": "Pyrin",
    "Chillet": "Elphidran",
    "Univolt": "Cinnamoth",
    "Foxcicle": "Elphidran",
    "Pyrin": "Elizabee",
    "Pyrin Noct": "Relaxaurus",
    "Reindrix": "Incineram",
    "Rayhound": "Penking",
    "Kitsun": "Anubis",
    "Dazzi": "Tombat",
    "Lunaris": "Blazehowl",
    "Dinossom": "Surfent",
    "Dinossom Lux": "Surfent",
    "Surfent": "Mossanda",
    "Surfent Terra": "Nitewing",
    "Maraith": "Rayhound",
    "Digtoise": "Anubis",
    "Tombat": "Penking",
    "Lovander": "Bushi",
    "Flambelle": "Digtoise",
    "Vanwyrm": "Wumpo Botan",
    "Vanwyrm Cryst": "Wumpo",
    "Bushi": "Kingpaca",
    "Beakon": "Menasting",
    "Ragnahawk": "Warsect",
    "Katress": "Azurobe",
    "Wixen": "Rayhound",
    "Verdash": "Bushi",
    "Vaelet": "Univolt",
    "Sibelyx": "Ragnahawk",
    "Elphidran": "Nitewing",
    "Elphidran Aqua": "Nitewing",
    "Kelpsea": "Petallia",
    "Kelpsea Ignis": "Arsox",
    "Azurobe": "Sweepa",
    "Cryolinx": "Beakon",
    "Blazehowl": "Azurobe",
    "Blazehowl Noct": "Wumpo Botan",
    "Relaxaurus": "Relaxaurus",
    "Relaxaurus Lux": "Relaxaurus",
    "Broncherry": "Anubis",
    "Broncherry Aqua": "Anubis",
    "Petallia": "Elphidran",
    "Reptyro": "Jormuntide",
    "Ice Reptyro": "Menasting",
    "Kingpaca": "Ragnahawk",
    "Ice Kingpaca": "Pyrin",
    "Mammorest": "Mammorest",
    "Mammorest Cryst": "Mammorest",
    "Wumpo": "Mammorest Cryst",
    "Wumpo Botan": "Ragnahawk",
    "Warsect": "Reptyro",
    "Fenglope": "Bushi",
    "Felbat": "Vanwyrm",
    "Quivern": "Reptyro",
    "Blazamut": "Astegon",
    "Helzephyr": "Menasting",
    "Astegon": "Beakon",
    "Menasting": "Relaxaurus",
    "Anubis": "Mossanda",
    "Jormuntide": "Jormuntide",
    "Jormuntide Ignis": "Jormuntide",
    "Suzaku": "Helzephyr",
    "Suzaku Aqua": "Astegon",
    "Grizzbolt": "Menasting",
    "Lyleen": "Relaxaurus",
    "Lyleen Noct": "Menasting",
    "Faleris": "Elizabee",
    "Orserk": "Beakon",
    "Shadowbeak": "Helzephyr",
    "Paladius": "Helzephyr",
    "Necromus": "Helzephyr",
    "Frostallion": "Beakon",
    "Frostallion Noct": "Helzephyr",
    "Jetragon": "Helzephyr"
  },
  "Mammorest Cryst": {
    "variant": true,
    "Lamball": "Reindrix",
    "Cattiva": "Reindrix",
    "Chikipi": "Dumud",
    "Lifmunk": "Broncherry",
    "Foxparks": "Digtoise",
    "Fuack": "Dinossom",
    "Sparkit": "Digtoise",
    "Tanzee": "Foxcicle",
    "Rooby": "Blazehowl",
    "Pengullet": "Dinossom",
    "Penking": "Sweepa",
    "Jolthog": "Kitsun",
    "Jolthog Cryst": "Kitsun",
    "Gumoss": "Foxcicle",
    "Gumoss (Special)": "Foxcicle",
    "Vixy": "Celaray",
    "Hoocrates": "Digtoise",
    "Teafant": "Melpaca",
    "Depresso": "Kitsun",
    "Cremis": "Celaray",
    "Daedream": "Foxcicle",
    "Rushoar": "Blazehowl",
    "Nox": "Rayhound",
    "Fuddler": "Tombat",
    "Killamari": "Arsox",
    "Mau": "Melpaca",
    "Mau Cryst": "Broncherry",
    "Celaray": "Anubis",
    "Direhowl": "Univolt",
    "Tocotoco": "Dinossom",
    "Flopie": "Arsox",
    "Mozzarina": "Incineram",
    "Bristla": "Chillet",
    "Gobfin": "Univolt",
    "Gobfin Ignis": "Katress",
    "Hangyu": "Digtoise",
    "Hangyu Cryst": "Broncherry",
    "Mossanda": "Pyrin",
    "Mossanda Lux": "Warsect",
    "Woolipop": "Rayhound",
    "Caprity": "Incineram",
    "Melpaca": "Incineram",
    "Eikthyrdeer": "Incineram",
    "Eikthyrdeer Terra": "Incineram",
    "Nitewing": "Pyrin",
    "Ribunny": "Chillet",
    "Incineram": "Sibelyx",
    "Incineram Noct": "Mossanda",
    "Cinnamoth": "Ragnahawk",
    "Arsox": "Elphidran",
    "Dumud": "Incineram",
    "Cawgnito": "Univolt",
    "Leezpunk": "Blazehowl",
    "Leezpunk Ignis": "Blazehowl",
    "Loupmoon": "Bushi",
    "Galeclaw": "Vanwyrm",
    "Robinquill": "Vanwyrm",
    "Robinquill Terra": "Bushi",
    "Gorirat": "Vanwyrm",
    "Beegarde": "Univolt",
    "Elizabee": "Jormuntide",
    "Grintale": "Sweepa",
    "Swee": "Arsox",
    "Sweepa": "Quivern",
    "Chillet": "Elphidran",
    "Univolt": "Wumpo Botan",
    "Foxcicle": "Penking",
    "Pyrin": "Reptyro",
    "Pyrin Noct": "Menasting",
    "Reindrix": "Incineram",
    "Rayhound": "Penking",
    "Kitsun": "Surfent",
    "Dazzi": "Tombat",
    "Lunaris": "Katress",
    "Dinossom": "Surfent",
    "Dinossom Lux": "Elphidran",
    "Surfent": "Nitewing",
    "Surfent Terra": "Nitewing",
    "Maraith": "Blazehowl",
    "Digtoise": "Anubis",
    "Tombat": "Penking",
    "Lovander": "Incineram",
    "Flambelle": "Digtoise",
    "Vanwyrm": "Wumpo Botan",
    "Vanwyrm Cryst": "Sibelyx",
    "Bushi": "Wumpo",
    "Beakon": "Menasting",
    "Ragnahawk": "Elizabee",
    "Katress": "Azurobe",
    "Wixen": "Rayhound",
    "Verdash": "Bushi",
    "Vaelet": "Univolt",
    "Sibelyx": "Pyrin",
    "Elphidran": "Nitewing",
    "Elphidran Aqua": "Sweepa",
    "Kelpsea": "Petallia",
    "Kelpsea Ignis": "Petallia",
    "Azurobe": "Sweepa",
    "Cryolinx": "Beakon",
    "Blazehowl": "Azurobe",
    "Blazehowl Noct": "Wumpo Botan",
    "Relaxaurus": "Relaxaurus",
    "Relaxaurus Lux": "Relaxaurus",
    "Broncherry": "Anubis",
    "Broncherry Aqua": "Anubis",
    "Petallia": "Elphidran",
    "Reptyro": "Jormuntide",
    "Ice Reptyro": "Menasting",
    "Kingpaca": "Ragnahawk",
    "Ice Kingpaca": "Pyrin",
    "Mammorest": "Mammorest",
    "Mammorest Cryst": "Mammorest Cryst",
    "Wumpo": "Ragnahawk",
    "Wumpo Botan": "Ragnahawk",
    "Warsect": "Jormuntide",
    "Fenglope": "Bushi",
    "Felbat": "Vanwyrm",
    "Quivern": "Reptyro",
    "Blazamut": "Astegon",
    "Helzephyr": "Beakon",
    "Astegon": "Beakon",
    "Menasting": "Relaxaurus",
    "Anubis": "Mossanda",
    "Jormuntide": "Mammorest",
    "Jormuntide Ignis": "Mammorest",
    "Suzaku": "Astegon",
    "Suzaku Aqua": "Astegon",
    "Grizzbolt": "Menasting",
    "Lyleen": "Relaxaurus",
    "Lyleen Noct": "Menasting",
    "Faleris": "Elizabee",
    "Orserk": "Beakon",
    "Shadowbeak": "Helzephyr",
    "Paladius": "Helzephyr",
    "Necromus": "Helzephyr",
    "Frostallion": "Beakon",
    "Frostallion Noct": "Helzephyr",
    "Jetragon": "Helzephyr"
  },
  "Wumpo": {
    "Lamball": "Loupmoon",
    "Cattiva": "Loupmoon",
    "Chikipi": "Fenglope",
    "Lifmunk": "Loupmoon",
    "Foxparks": "Caprity",
    "Fuack": "Dumud",
    "Sparkit": "Caprity",
    "Tanzee": "Digtoise",
    "Rooby": "Chillet",
    "Pengullet": "Mozzarina",
    "Penking": "Cinnamoth",
    "Jolthog": "Eikthyrdeer",
    "Jolthog Cryst": "Mozzarina",
    "Gumoss": "Digtoise",
    "Gumoss (Special)": "Digtoise",
    "Vixy": "Loupmoon",
    "Hoocrates": "Eikthyrdeer",
    "Teafant": "Fenglope",
    "Depresso": "Eikthyrdeer",
    "Cremis": "Loupmoon",
    "Daedream": "Digtoise",
    "Rushoar": "Arsox",
    "Nox": "Dinossom",
    "Fuddler": "Digtoise",
    "Killamari": "Reindrix",
    "Mau": "Fenglope",
    "Mau Cryst": "Loupmoon",
    "Celaray": "Vanwyrm",
    "Direhowl": "Foxcicle",
    "Tocotoco": "Dumud",
    "Flopie": "Celaray",
    "Mozzarina": "Univolt",
    "Bristla": "Melpaca",
    "Gobfin": "Petallia",
    "Gobfin Ignis": "Petallia",
    "Hangyu": "Lovander",
    "Hangyu Cryst": "Lovander",
    "Mossanda": "Sibelyx",
    "Mossanda Lux": "Nitewing",
    "Woolipop": "Kitsun",
    "Caprity": "Katress",
    "Melpaca": "Univolt",
    "Eikthyrdeer": "Univolt",
    "Eikthyrdeer Terra": "Univolt",
    "Nitewing": "Sibelyx",
    "Ribunny": "Melpaca",
    "Incineram": "Penking",
    "Incineram Noct": "Penking",
    "Cinnamoth": "Wumpo Botan",
    "Arsox": "Bushi",
    "Dumud": "Univolt",
    "Cawgnito": "Foxcicle",
    "Leezpunk": "Arsox",
    "Leezpunk Ignis": "Chillet",
    "Loupmoon": "Blazehowl",
    "Galeclaw": "Tombat",
    "Robinquill": "Rayhound",
    "Robinquill Terra": "Rayhound",
    "Gorirat": "Tombat",
    "Beegarde": "Foxcicle",
    "Elizabee": "Sweepa",
    "Grintale": "Wumpo Botan",
    "Swee": "Reindrix",
    "Sweepa": "Mossanda",
    "Chillet": "Bushi",
    "Univolt": "Anubis",
    "Foxcicle": "Incineram",
    "Pyrin": "Sweepa",
    "Pyrin Noct": "Quivern",
    "Reindrix": "Univolt",
    "Rayhound": "Incineram",
    "Kitsun": "Bushi",
    "Dazzi": "Kitsun",
    "Lunaris": "Arsox",
    "Dinossom": "Bushi",
    "Dinossom Lux": "Bushi",
    "Surfent": "Grintale",
    "Surfent Terra": "Azurobe",
    "Maraith": "Chillet",
    "Digtoise": "Vanwyrm",
    "Tombat": "Incineram",
    "Lovander": "Katress",
    "Flambelle": "Caprity",
    "Vanwyrm": "Surfent",
    "Vanwyrm Cryst": "Elphidran",
    "Bushi": "Elphidran",
    "Beakon": "Warsect",
    "Ragnahawk": "Nitewing",
    "Katress": "Anubis",
    "Wixen": "Dinossom",
    "Verdash": "Rayhound",
    "Vaelet": "Tombat",
    "Sibelyx": "Sibelyx",
    "Elphidran": "Azurobe",
    "Elphidran Aqua": "Azurobe",
    "Kelpsea": "Broncherry",
    "Kelpsea Ignis": "Broncherry",
    "Azurobe": "Wumpo Botan",
    "Cryolinx": "Mammorest",
    "Blazehowl": "Incineram",
    "Blazehowl Noct": "Anubis",
    "Relaxaurus": "Pyrin",
    "Relaxaurus Lux": "Pyrin",
    "Broncherry": "Vanwyrm",
    "Broncherry Aqua": "Vanwyrm",
    "Petallia": "Bushi",
    "Reptyro": "Ragnahawk",
    "Ice Reptyro": "Warsect",
    "Kingpaca": "Wumpo",
    "Ice Kingpaca": "Sibelyx",
    "Mammorest": "Mammorest Cryst",
    "Mammorest Cryst": "Ragnahawk",
    "Wumpo": "Wumpo",
    "Wumpo Botan": "Kingpaca",
    "Warsect": "Sweepa",
    "Fenglope": "Blazehowl",
    "Felbat": "Rayhound",
    "Quivern": "Sweepa",
    "Blazamut": "Beakon",
    "Helzephyr": "Reptyro",
    "Astegon": "Jormuntide",
    "Menasting": "Pyrin",
    "Anubis": "Penking",
    "Jormuntide": "Ragnahawk",
    "Jormuntide Ignis": "Ragnahawk",
    "Suzaku": "Menasting",
    "Suzaku Aqua": "Menasting",
    "Grizzbolt": "Elizabee",
    "Lyleen": "Pyrin",
    "Lyleen Noct": "Elizabee",
    "Faleris": "Nitewing",
    "Orserk": "Mammorest",
    "Shadowbeak": "Menasting",
    "Paladius": "Relaxaurus",
    "Necromus": "Menasting",
    "Frostallion": "Relaxaurus",
    "Frostallion Noct": "Relaxaurus",
    "Jetragon": "Relaxaurus"
  },
  "Wumpo Botan": {
    "variant": true,
    "Lamball": "Fenglope",
    "Cattiva": "Fenglope",
    "Chikipi": "Verdash",
    "Lifmunk": "Loupmoon",
    "Foxparks": "Lovander",
    "Fuack": "Mozzarina",
    "Sparkit": "Loupmoon",
    "Tanzee": "Broncherry",
    "Rooby": "Dinossom",
    "Pengullet": "Eikthyrdeer",
    "Penking": "Azurobe",
    "Jolthog": "Eikthyrdeer",
    "Jolthog Cryst": "Eikthyrdeer",
    "Gumoss": "Broncherry",
    "Gumoss (Special)": "Broncherry",
    "Vixy": "Loupmoon",
    "Hoocrates": "Caprity",
    "Teafant": "Fenglope",
    "Depresso": "Caprity",
    "Cremis": "Fenglope",
    "Daedream": "Digtoise",
    "Rushoar": "Chillet",
    "Nox": "Kitsun",
    "Fuddler": "Digtoise",
    "Killamari": "Melpaca",
    "Mau": "Fenglope",
    "Mau Cryst": "Loupmoon",
    "Celaray": "Univolt",
    "Direhowl": "Foxcicle",
    "Tocotoco": "Mozzarina",
    "Flopie": "Reindrix",
    "Mozzarina": "Katress",
    "Bristla": "Dumud",
    "Gobfin": "Arsox",
    "Gobfin Ignis": "Arsox",
    "Hangyu": "Loupmoon",
    "Hangyu Cryst": "Loupmoon",
    "Mossanda": "Sibelyx",
    "Mossanda Lux": "Mossanda",
    "Woolipop": "Kitsun",
    "Caprity": "Blazehowl",
    "Melpaca": "Univolt",
    "Eikthyrdeer": "Katress",
    "Eikthyrdeer Terra": "Univolt",
    "Nitewing": "Sibelyx",
    "Ribunny": "Dumud",
    "Incineram": "Elphidran",
    "Incineram Noct": "Elphidran",
    "Cinnamoth": "Wumpo Botan",
    "Arsox": "Bushi",
    "Dumud": "Univolt",
    "Cawgnito": "Petallia",
    "Leezpunk": "Chillet",
    "Leezpunk Ignis": "Dinossom",
    "Loupmoon": "Blazehowl",
    "Galeclaw": "Tombat",
    "Robinquill": "Tombat",
    "Robinquill Terra": "Rayhound",
    "Gorirat": "Foxcicle",
    "Beegarde": "Petallia",
    "Elizabee": "Sweepa",
    "Grintale": "Azurobe",
    "Swee": "Melpaca",
    "Sweepa": "Sibelyx",
    "Chillet": "Bushi",
    "Univolt": "Anubis",
    "Foxcicle": "Bushi",
    "Pyrin": "Nitewing",
    "Pyrin Noct": "Pyrin",
    "Reindrix": "Univolt",
    "Rayhound": "Incineram",
    "Kitsun": "Vanwyrm",
    "Dazzi": "Digtoise",
    "Lunaris": "Arsox",
    "Dinossom": "Vanwyrm",
    "Dinossom Lux": "Bushi",
    "Surfent": "Penking",
    "Surfent Terra": "Penking",
    "Maraith": "Dinossom",
    "Digtoise": "Vanwyrm",
    "Tombat": "Incineram",
    "Lovander": "Blazehowl",
    "Flambelle": "Lovander",
    "Vanwyrm": "Anubis",
    "Vanwyrm Cryst": "Elphidran",
    "Bushi": "Surfent",
    "Beakon": "Quivern",
    "Ragnahawk": "Mossanda",
    "Katress": "Incineram",
    "Wixen": "Dinossom",
    "Verdash": "Rayhound",
    "Vaelet": "Foxcicle",
    "Sibelyx": "Wumpo",
    "Elphidran": "Grintale",
    "Elphidran Aqua": "Azurobe",
    "Kelpsea": "Celaray",
    "Kelpsea Ignis": "Reindrix",
    "Azurobe": "Cinnamoth",
    "Cryolinx": "Jormuntide",
    "Blazehowl": "Incineram",
    "Blazehowl Noct": "Anubis",
    "Relaxaurus": "Ragnahawk",
    "Relaxaurus Lux": "Ragnahawk",
    "Broncherry": "Univolt",
    "Broncherry Aqua": "Vanwyrm",
    "Petallia": "Bushi",
    "Reptyro": "Sweepa",
    "Ice Reptyro": "Pyrin",
    "Kingpaca": "Wumpo Botan",
    "Ice Kingpaca": "Wumpo",
    "Mammorest": "Ragnahawk",
    "Mammorest Cryst": "Ragnahawk",
    "Wumpo": "Kingpaca",
    "Wumpo Botan": "Wumpo Botan",
    "Warsect": "Sweepa",
    "Fenglope": "Rayhound",
    "Felbat": "Tombat",
    "Quivern": "Nitewing",
    "Blazamut": "Menasting",
    "Helzephyr": "Elizabee",
    "Astegon": "Jormuntide",
    "Menasting": "Pyrin",
    "Anubis": "Penking",
    "Jormuntide": "Sweepa",
    "Jormuntide Ignis": "Sweepa",
    "Suzaku": "Menasting",
    "Suzaku Aqua": "Menasting",
    "Grizzbolt": "Warsect",
    "Lyleen": "Pyrin",
    "Lyleen Noct": "Warsect",
    "Faleris": "Nitewing",
    "Orserk": "Jormuntide",
    "Shadowbeak": "Relaxaurus",
    "Paladius": "Relaxaurus",
    "Necromus": "Relaxaurus",
    "Frostallion": "Mammorest",
    "Frostallion Noct": "Relaxaurus",
    "Jetragon": "Relaxaurus"
  },
  "Warsect": {
    "Lamball": "Mozzarina",
    "Cattiva": "Dumud",
    "Chikipi": "Eikthyrdeer",
    "Lifmunk": "Melpaca",
    "Foxparks": "Celaray",
    "Fuack": "Kitsun",
    "Sparkit": "Reindrix",
    "Tanzee": "Arsox",
    "Rooby": "Tombat",
    "Pengullet": "Digtoise",
    "Penking": "Mossanda",
    "Jolthog": "Digtoise",
    "Jolthog Cryst": "Digtoise",
    "Gumoss": "Arsox",
    "Gumoss (Special)": "Arsox",
    "Vixy": "Dumud",
    "Hoocrates": "Broncherry",
    "Teafant": "Eikthyrdeer",
    "Depresso": "Broncherry",
    "Cremis": "Dumud",
    "Daedream": "Arsox",
    "Rushoar": "Rayhound",
    "Nox": "Foxcicle",
    "Fuddler": "Petallia",
    "Killamari": "Dinossom",
    "Mau": "Mozzarina",
    "Mau Cryst": "Melpaca",
    "Celaray": "Incineram",
    "Direhowl": "Katress",
    "Tocotoco": "Digtoise",
    "Flopie": "Dinossom",
    "Mozzarina": "Bushi",
    "Bristla": "Kitsun",
    "Gobfin": "Blazehowl",
    "Gobfin Ignis": "Blazehowl",
    "Hangyu": "Reindrix",
    "Hangyu Cryst": "Reindrix",
    "Mossanda": "Ragnahawk",
    "Mossanda Lux": "Pyrin",
    "Woolipop": "Foxcicle",
    "Caprity": "Bushi",
    "Melpaca": "Incineram",
    "Eikthyrdeer": "Bushi",
    "Eikthyrdeer Terra": "Bushi",
    "Nitewing": "Ragnahawk",
    "Ribunny": "Kitsun",
    "Incineram": "Wumpo",
    "Incineram Noct": "Wumpo",
    "Cinnamoth": "Nitewing",
    "Arsox": "Anubis",
    "Dumud": "Bushi",
    "Cawgnito": "Blazehowl",
    "Leezpunk": "Rayhound",
    "Leezpunk Ignis": "Rayhound",
    "Loupmoon": "Bushi",
    "Galeclaw": "Univolt",
    "Robinquill": "Univolt",
    "Robinquill Terra": "Univolt",
    "Gorirat": "Univolt",
    "Beegarde": "Blazehowl",
    "Elizabee": "Elizabee",
    "Grintale": "Nitewing",
    "Swee": "Dinossom",
    "Sweepa": "Ragnahawk",
    "Chillet": "Anubis",
    "Univolt": "Grintale",
    "Foxcicle": "Elphidran",
    "Pyrin": "Quivern",
    "Pyrin Noct": "Relaxaurus",
    "Reindrix": "Incineram",
    "Rayhound": "Elphidran",
    "Kitsun": "Incineram",
    "Dazzi": "Petallia",
    "Lunaris": "Rayhound",
    "Dinossom": "Anubis",
    "Dinossom Lux": "Anubis",
    "Surfent": "Sibelyx",
    "Surfent Terra": "Sibelyx",
    "Maraith": "Tombat",
    "Digtoise": "Incineram",
    "Tombat": "Elphidran",
    "Lovander": "Bushi",
    "Flambelle": "Celaray",
    "Vanwyrm": "Azurobe",
    "Vanwyrm Cryst": "Wumpo Botan",
    "Bushi": "Cinnamoth",
    "Beakon": "Relaxaurus",
    "Ragnahawk": "Pyrin",
    "Katress": "Penking",
    "Wixen": "Tombat",
    "Verdash": "Vanwyrm",
    "Vaelet": "Katress",
    "Sibelyx": "Sweepa",
    "Elphidran": "Sibelyx",
    "Elphidran Aqua": "Mossanda",
    "Kelpsea": "Chillet",
    "Kelpsea Ignis": "Chillet",
    "Azurobe": "Nitewing",
    "Cryolinx": "Beakon",
    "Blazehowl": "Penking",
    "Blazehowl Noct": "Azurobe",
    "Relaxaurus": "Jormuntide",
    "Relaxaurus Lux": "Jormuntide",
    "Broncherry": "Incineram",
    "Broncherry Aqua": "Incineram",
    "Petallia": "Surfent",
    "Reptyro": "Elizabee",
    "Ice Reptyro": "Relaxaurus",
    "Kingpaca": "Sweepa",
    "Ice Kingpaca": "Ragnahawk",
    "Mammorest": "Reptyro",
    "Mammorest Cryst": "Jormuntide",
    "Wumpo": "Sweepa",
    "Wumpo Botan": "Sweepa",
    "Warsect": "Warsect",
    "Fenglope": "Vanwyrm",
    "Felbat": "Univolt",
    "Quivern": "Warsect",
    "Blazamut": "Helzephyr",
    "Helzephyr": "Menasting",
    "Astegon": "Menasting",
    "Menasting": "Mammorest",
    "Anubis": "Sibelyx",
    "Jormuntide": "Reptyro",
    "Jormuntide Ignis": "Elizabee",
    "Suzaku": "Helzephyr",
    "Suzaku Aqua": "Helzephyr",
    "Grizzbolt": "Relaxaurus",
    "Lyleen": "Mammorest",
    "Lyleen Noct": "Relaxaurus",
    "Faleris": "Pyrin",
    "Orserk": "Beakon",
    "Shadowbeak": "Helzephyr",
    "Paladius": "Beakon",
    "Necromus": "Beakon",
    "Frostallion": "Beakon",
    "Frostallion Noct": "Beakon",
    "Jetragon": "Beakon"
  },
  "Fenglope": {
    "Lamball": "Fuddler",
    "Cattiva": "Fuddler",
    "Chikipi": "Gumoss",
    "Lifmunk": "Dazzi",
    "Foxparks": "Woolipop",
    "Fuack": "Rooby",
    "Sparkit": "Woolipop",
    "Tanzee": "Lunaris",
    "Rooby": "Beegarde",
    "Pengullet": "Wixen",
    "Penking": "Tombat",
    "Jolthog": "Nox",
    "Jolthog Cryst": "Wixen",
    "Gumoss": "Lunaris",
    "Gumoss (Special)": "Lunaris",
    "Vixy": "Dazzi",
    "Hoocrates": "Woolipop",
    "Teafant": "Daedream",
    "Depresso": "Nox",
    "Cremis": "Fuddler",
    "Daedream": "Lunaris",
    "Rushoar": "Direhowl",
    "Nox": "Cawgnito",
    "Fuddler": "Lunaris",
    "Killamari": "Rushoar",
    "Mau": "Daedream",
    "Mau Cryst": "Dazzi",
    "Celaray": "Eikthyrdeer",
    "Direhowl": "Robinquill",
    "Tocotoco": "Wixen",
    "Flopie": "Rushoar",
    "Mozzarina": "Loupmoon",
    "Bristla": "Maraith",
    "Gobfin": "Galeclaw",
    "Gobfin Ignis": "Gorirat",
    "Hangyu": "Dazzi",
    "Hangyu Cryst": "Dazzi",
    "Mossanda": "Blazehowl",
    "Mossanda Lux": "Univolt",
    "Woolipop": "Gobfin",
    "Caprity": "Loupmoon",
    "Melpaca": "Caprity",
    "Eikthyrdeer": "Loupmoon",
    "Eikthyrdeer Terra": "Lovander",
    "Nitewing": "Katress",
    "Ribunny": "Maraith",
    "Incineram": "Arsox",
    "Incineram Noct": "Petallia",
    "Cinnamoth": "Rayhound",
    "Arsox": "Melpaca",
    "Dumud": "Lovander",
    "Cawgnito": "Galeclaw",
    "Leezpunk": "Vaelet",
    "Leezpunk Ignis": "Direhowl",
    "Loupmoon": "Loupmoon",
    "Galeclaw": "Felbat",
    "Robinquill": "Felbat",
    "Robinquill Terra": "Verdash",
    "Gorirat": "Felbat",
    "Beegarde": "Galeclaw",
    "Elizabee": "Vanwyrm",
    "Grintale": "Tombat",
    "Swee": "Rushoar",
    "Sweepa": "Katress",
    "Chillet": "Melpaca",
    "Univolt": "Kitsun",
    "Foxcicle": "Celaray",
    "Pyrin": "Univolt",
    "Pyrin Noct": "Incineram",
    "Reindrix": "Caprity",
    "Rayhound": "Broncherry",
    "Kitsun": "Mozzarina",
    "Dazzi": "Gobfin",
    "Lunaris": "Gorirat",
    "Dinossom": "Dumud",
    "Dinossom Lux": "Dumud",
    "Surfent": "Foxcicle",
    "Surfent Terra": "Foxcicle",
    "Maraith": "Direhowl",
    "Digtoise": "Eikthyrdeer",
    "Tombat": "Broncherry",
    "Lovander": "Loupmoon",
    "Flambelle": "Woolipop",
    "Vanwyrm": "Dinossom",
    "Vanwyrm Cryst": "Chillet",
    "Bushi": "Dinossom",
    "Beakon": "Incineram",
    "Ragnahawk": "Univolt",
    "Katress": "Digtoise",
    "Wixen": "Beegarde",
    "Verdash": "Fenglope",
    "Vaelet": "Robinquill",
    "Sibelyx": "Blazehowl",
    "Elphidran": "Foxcicle",
    "Elphidran Aqua": "Tombat",
    "Kelpsea": "Leezpunk",
    "Kelpsea Ignis": "Rushoar",
    "Azurobe": "Rayhound",
    "Cryolinx": "Surfent",
    "Blazehowl": "Digtoise",
    "Blazehowl Noct": "Kitsun",
    "Relaxaurus": "Bushi",
    "Relaxaurus Lux": "Bushi",
    "Broncherry": "Eikthyrdeer",
    "Broncherry Aqua": "Mozzarina",
    "Petallia": "Reindrix",
    "Reptyro": "Vanwyrm",
    "Ice Reptyro": "Incineram",
    "Kingpaca": "Rayhound",
    "Ice Kingpaca": "Blazehowl",
    "Mammorest": "Bushi",
    "Mammorest Cryst": "Bushi",
    "Wumpo": "Blazehowl",
    "Wumpo Botan": "Rayhound",
    "Warsect": "Vanwyrm",
    "Fenglope": "Fenglope",
    "Felbat": "Verdash",
    "Quivern": "Vanwyrm",
    "Blazamut": "Azurobe",
    "Helzephyr": "Incineram",
    "Astegon": "Anubis",
    "Menasting": "Bushi",
    "Anubis": "Petallia",
    "Jormuntide": "Bushi",
    "Jormuntide Ignis": "Bushi",
    "Suzaku": "Penking",
    "Suzaku Aqua": "Azurobe",
    "Grizzbolt": "Incineram",
    "Lyleen": "Incineram",
    "Lyleen Noct": "Incineram",
    "Faleris": "Univolt",
    "Orserk": "Surfent",
    "Shadowbeak": "Penking",
    "Paladius": "Elphidran",
    "Necromus": "Penking",
    "Frostallion": "Elphidran",
    "Frostallion Noct": "Elphidran",
    "Jetragon": "Elphidran"
  },
  "Felbat": {
    "Lamball": "Gumoss",
    "Cattiva": "Daedream",
    "Chikipi": "Kelpsea",
    "Lifmunk": "Fuddler",
    "Foxparks": "Dazzi",
    "Fuack": "Wixen",
    "Sparkit": "Dazzi",
    "Tanzee": "Rushoar",
    "Rooby": "Cawgnito",
    "Pengullet": "Nox",
    "Penking": "Foxcicle",
    "Jolthog": "Woolipop",
    "Jolthog Cryst": "Woolipop",
    "Gumoss": "Rushoar",
    "Gumoss (Special)": "Rushoar",
    "Vixy": "Daedream",
    "Hoocrates": "Dazzi",
    "Teafant": "Tanzee",
    "Depresso": "Woolipop",
    "Cremis": "Daedream",
    "Daedream": "Leezpunk",
    "Rushoar": "Beegarde",
    "Nox": "Gobfin",
    "Fuddler": "Lunaris",
    "Killamari": "Maraith",
    "Mau": "Tanzee",
    "Mau Cryst": "Fuddler",
    "Celaray": "Lovander",
    "Direhowl": "Galeclaw",
    "Tocotoco": "Nox",
    "Flopie": "Maraith",
    "Mozzarina": "Loupmoon",
    "Bristla": "Wixen",
    "Gobfin": "Vaelet",
    "Gobfin Ignis": "Direhowl",
    "Hangyu": "Dazzi",
    "Hangyu Cryst": "Fuddler",
    "Mossanda": "Blazehowl",
    "Mossanda Lux": "Katress",
    "Woolipop": "Lunaris",
    "Caprity": "Fenglope",
    "Melpaca": "Loupmoon",
    "Eikthyrdeer": "Loupmoon",
    "Eikthyrdeer Terra": "Loupmoon",
    "Nitewing": "Blazehowl",
    "Ribunny": "Wixen",
    "Incineram": "Chillet",
    "Incineram Noct": "Arsox",
    "Cinnamoth": "Tombat",
    "Arsox": "Dumud",
    "Dumud": "Loupmoon",
    "Cawgnito": "Gorirat",
    "Leezpunk": "Direhowl",
    "Leezpunk Ignis": "Cawgnito",
    "Loupmoon": "Fenglope",
    "Galeclaw": "Robinquill",
    "Robinquill": "Robinquill",
    "Robinquill Terra": "Felbat",
    "Gorirat": "Galeclaw",
    "Beegarde": "Gorirat",
    "Elizabee": "Univolt",
    "Grintale": "Foxcicle",
    "Swee": "Rooby",
    "Sweepa": "Blazehowl",
    "Chillet": "Mozzarina",
    "Univolt": "Digtoise",
    "Foxcicle": "Melpaca",
    "Pyrin": "Univolt",
    "Pyrin Noct": "Bushi",
    "Reindrix": "Loupmoon",
    "Rayhound": "Reindrix",
    "Kitsun": "Eikthyrdeer",
    "Dazzi": "Lunaris",
    "Lunaris": "Direhowl",
    "Dinossom": "Eikthyrdeer",
    "Dinossom Lux": "Mozzarina",
    "Surfent": "Arsox",
    "Surfent Terra": "Petallia",
    "Maraith": "Cawgnito",
    "Digtoise": "Caprity",
    "Tombat": "Reindrix",
    "Lovander": "Fenglope",
    "Flambelle": "Dazzi",
    "Vanwyrm": "Kitsun",
    "Vanwyrm Cryst": "Dinossom",
    "Bushi": "Kitsun",
    "Beakon": "Incineram",
    "Ragnahawk": "Katress",
    "Katress": "Digtoise",
    "Wixen": "Gobfin",
    "Verdash": "Felbat",
    "Vaelet": "Galeclaw",
    "Sibelyx": "Rayhound",
    "Elphidran": "Petallia",
    "Elphidran Aqua": "Foxcicle",
    "Kelpsea": "Rushoar",
    "Kelpsea Ignis": "Rushoar",
    "Azurobe": "Tombat",
    "Cryolinx": "Anubis",
    "Blazehowl": "Blazehowl Noct",
    "Blazehowl Noct": "Digtoise",
    "Relaxaurus": "Bushi",
    "Relaxaurus Lux": "Bushi",
    "Broncherry": "Caprity",
    "Broncherry Aqua": "Eikthyrdeer",
    "Petallia": "Dumud",
    "Reptyro": "Vanwyrm",
    "Ice Reptyro": "Bushi",
    "Kingpaca": "Rayhound",
    "Ice Kingpaca": "Rayhound",
    "Mammorest": "Vanwyrm",
    "Mammorest Cryst": "Vanwyrm",
    "Wumpo": "Rayhound",
    "Wumpo Botan": "Tombat",
    "Warsect": "Univolt",
    "Fenglope": "Verdash",
    "Felbat": "Felbat",
    "Quivern": "Univolt",
    "Blazamut": "Grintale",
    "Helzephyr": "Incineram",
    "Astegon": "Anubis",
    "Menasting": "Bushi",
    "Anubis": "Arsox",
    "Jormuntide": "Vanwyrm",
    "Jormuntide Ignis": "Vanwyrm",
    "Suzaku": "Elphidran",
    "Suzaku Aqua": "Penking",
    "Grizzbolt": "Incineram",
    "Lyleen": "Bushi",
    "Lyleen Noct": "Incineram",
    "Faleris": "Univolt",
    "Orserk": "Anubis",
    "Shadowbeak": "Elphidran",
    "Paladius": "Elphidran",
    "Necromus": "Elphidran",
    "Frostallion": "Anubis",
    "Frostallion Noct": "Surfent",
    "Jetragon": "Elphidran"
  },
  "Quivern": {
    "Lamball": "Mozzarina",
    "Cattiva": "Mozzarina",
    "Chikipi": "Eikthyrdeer",
    "Lifmunk": "Melpaca",
    "Foxparks": "Reindrix",
    "Fuack": "Digtoise",
    "Sparkit": "Reindrix",
    "Tanzee": "Chillet",
    "Rooby": "Tombat",
    "Pengullet": "Digtoise",
    "Penking": "Mossanda",
    "Jolthog": "Broncherry",
    "Jolthog Cryst": "Digtoise",
    "Gumoss": "Arsox",
    "Gumoss (Special)": "Arsox",
    "Vixy": "Dumud",
    "Hoocrates": "Celaray",
    "Teafant": "Eikthyrdeer",
    "Depresso": "Broncherry",
    "Cremis": "Mozzarina",
    "Daedream": "Arsox",
    "Rushoar": "Rayhound",
    "Nox": "Foxcicle",
    "Fuddler": "Arsox",
    "Killamari": "Dinossom",
    "Mau": "Eikthyrdeer",
    "Mau Cryst": "Dumud",
    "Celaray": "Incineram",
    "Direhowl": "Blazehowl",
    "Tocotoco": "Digtoise",
    "Flopie": "Dinossom",
    "Mozzarina": "Bushi",
    "Bristla": "Kitsun",
    "Gobfin": "Blazehowl",
    "Gobfin Ignis": "Rayhound",
    "Hangyu": "Melpaca",
    "Hangyu Cryst": "Melpaca",
    "Mossanda": "Ragnahawk",
    "Mossanda Lux": "Pyrin",
    "Woolipop": "Foxcicle",
    "Caprity": "Bushi",
    "Melpaca": "Bushi",
    "Eikthyrdeer": "Bushi",
    "Eikthyrdeer Terra": "Bushi",
    "Nitewing": "Ragnahawk",
    "Ribunny": "Kitsun",
    "Incineram": "Kingpaca",
    "Incineram Noct": "Wumpo",
    "Cinnamoth": "Nitewing",
    "Arsox": "Anubis",
    "Dumud": "Bushi",
    "Cawgnito": "Blazehowl",
    "Leezpunk": "Rayhound",
    "Leezpunk Ignis": "Tombat",
    "Loupmoon": "Vanwyrm",
    "Galeclaw": "Univolt",
    "Robinquill": "Univolt",
    "Robinquill Terra": "Univolt",
    "Gorirat": "Katress",
    "Beegarde": "Blazehowl",
    "Elizabee": "Warsect",
    "Grintale": "Mossanda",
    "Swee": "Kitsun",
    "Sweepa": "Ragnahawk",
    "Chillet": "Anubis",
    "Univolt": "Penking",
    "Foxcicle": "Surfent",
    "Pyrin": "Pyrin",
    "Pyrin Noct": "Mammorest",
    "Reindrix": "Incineram",
    "Rayhound": "Elphidran",
    "Kitsun": "Incineram",
    "Dazzi": "Petallia",
    "Lunaris": "Rayhound",
    "Dinossom": "Incineram",
    "Dinossom Lux": "Anubis",
    "Surfent": "Sibelyx",
    "Surfent Terra": "Sibelyx",
    "Maraith": "Tombat",
    "Digtoise": "Incineram",
    "Tombat": "Elphidran",
    "Lovander": "Bushi",
    "Flambelle": "Reindrix",
    "Vanwyrm": "Azurobe",
    "Vanwyrm Cryst": "Wumpo Botan",
    "Bushi": "Azurobe",
    "Beakon": "Relaxaurus",
    "Ragnahawk": "Pyrin",
    "Katress": "Penking",
    "Wixen": "Tombat",
    "Verdash": "Univolt",
    "Vaelet": "Katress",
    "Sibelyx": "Sweepa",
    "Elphidran": "Sibelyx",
    "Elphidran Aqua": "Sibelyx",
    "Kelpsea": "Chillet",
    "Kelpsea Ignis": "Dinossom",
    "Azurobe": "Nitewing",
    "Cryolinx": "Beakon",
    "Blazehowl": "Elphidran",
    "Blazehowl Noct": "Grintale",
    "Relaxaurus": "Jormuntide",
    "Relaxaurus Lux": "Jormuntide",
    "Broncherry": "Incineram",
    "Broncherry Aqua": "Incineram",
    "Petallia": "Anubis",
    "Reptyro": "Elizabee",
    "Ice Reptyro": "Relaxaurus",
    "Kingpaca": "Sweepa",
    "Ice Kingpaca": "Sweepa",
    "Mammorest": "Reptyro",
    "Mammorest Cryst": "Reptyro",
    "Wumpo": "Sweepa",
    "Wumpo Botan": "Nitewing",
    "Warsect": "Warsect",
    "Fenglope": "Vanwyrm",
    "Felbat": "Univolt",
    "Quivern": "Quivern",
    "Blazamut": "Helzephyr",
    "Helzephyr": "Relaxaurus",
    "Astegon": "Menasting",
    "Menasting": "Jormuntide",
    "Anubis": "Wumpo",
    "Jormuntide": "Elizabee",
    "Jormuntide Ignis": "Elizabee",
    "Suzaku": "Helzephyr",
    "Suzaku Aqua": "Helzephyr",
    "Grizzbolt": "Relaxaurus",
    "Lyleen": "Mammorest",
    "Lyleen Noct": "Relaxaurus",
    "Faleris": "Pyrin",
    "Orserk": "Menasting",
    "Shadowbeak": "Beakon",
    "Paladius": "Beakon",
    "Necromus": "Beakon",
    "Frostallion": "Beakon",
    "Frostallion Noct": "Beakon",
    "Jetragon": "Beakon"
  },
  "Blazamut": {
    "Lamball": "Rayhound",
    "Cattiva": "Rayhound",
    "Chikipi": "Tombat",
    "Lifmunk": "Blazehowl",
    "Foxparks": "Blazehowl",
    "Fuack": "Univolt",
    "Sparkit": "Blazehowl",
    "Tanzee": "Bushi",
    "Rooby": "Incineram",
    "Pengullet": "Univolt",
    "Penking": "Menasting",
    "Jolthog": "Univolt",
    "Jolthog Cryst": "Univolt",
    "Gumoss": "Bushi",
    "Gumoss (Special)": "Bushi",
    "Vixy": "Rayhound",
    "Hoocrates": "Katress",
    "Teafant": "Tombat",
    "Depresso": "Katress",
    "Cremis": "Rayhound",
    "Daedream": "Bushi",
    "Rushoar": "Anubis",
    "Nox": "Incineram",
    "Fuddler": "Incineram",
    "Killamari": "Vanwyrm",
    "Mau": "Tombat",
    "Mau Cryst": "Rayhound",
    "Celaray": "Sibelyx",
    "Direhowl": "Elphidran",
    "Tocotoco": "Univolt",
    "Flopie": "Bushi",
    "Mozzarina": "Wumpo",
    "Bristla": "Vanwyrm",
    "Gobfin": "Elphidran",
    "Gobfin Ignis": "Surfent",
    "Hangyu": "Blazehowl",
    "Hangyu Cryst": "Blazehowl",
    "Mossanda": "Beakon",
    "Mossanda Lux": "Helzephyr",
    "Woolipop": "Incineram",
    "Caprity": "Kingpaca",
    "Melpaca": "Sibelyx",
    "Eikthyrdeer": "Wumpo",
    "Eikthyrdeer Terra": "Sibelyx",
    "Nitewing": "Beakon",
    "Ribunny": "Vanwyrm",
    "Incineram": "Mammorest",
    "Incineram Noct": "Mammorest",
    "Cinnamoth": "Menasting",
    "Arsox": "Sweepa",
    "Dumud": "Sibelyx",
    "Cawgnito": "Elphidran",
    "Leezpunk": "Anubis",
    "Leezpunk Ignis": "Anubis",
    "Loupmoon": "Wumpo Botan",
    "Galeclaw": "Penking",
    "Robinquill": "Penking",
    "Robinquill Terra": "Azurobe",
    "Gorirat": "Penking",
    "Beegarde": "Elphidran",
    "Elizabee": "Astegon",
    "Grintale": "Menasting",
    "Swee": "Vanwyrm",
    "Sweepa": "Beakon",
    "Chillet": "Sweepa",
    "Univolt": "Warsect",
    "Foxcicle": "Ragnahawk",
    "Pyrin": "Helzephyr",
    "Pyrin Noct": "Cryolinx",
    "Reindrix": "Sibelyx",
    "Rayhound": "Ragnahawk",
    "Kitsun": "Nitewing",
    "Dazzi": "Incineram",
    "Lunaris": "Surfent",
    "Dinossom": "Nitewing",
    "Dinossom Lux": "Sweepa",
    "Surfent": "Relaxaurus",
    "Surfent Terra": "Relaxaurus",
    "Maraith": "Anubis",
    "Digtoise": "Mossanda",
    "Tombat": "Ragnahawk",
    "Lovander": "Wumpo Botan",
    "Flambelle": "Blazehowl",
    "Vanwyrm": "Elizabee",
    "Vanwyrm Cryst": "Jormuntide",
    "Bushi": "Reptyro",
    "Beakon": "Cryolinx",
    "Ragnahawk": "Helzephyr",
    "Katress": "Pyrin",
    "Wixen": "Incineram",
    "Verdash": "Azurobe",
    "Vaelet": "Elphidran",
    "Sibelyx": "Beakon",
    "Elphidran": "Relaxaurus",
    "Elphidran Aqua": "Relaxaurus",
    "Kelpsea": "Bushi",
    "Kelpsea Ignis": "Bushi",
    "Azurobe": "Menasting",
    "Cryolinx": "Suzaku",
    "Blazehowl": "Pyrin",
    "Blazehowl Noct": "Warsect",
    "Relaxaurus": "Astegon",
    "Relaxaurus Lux": "Cryolinx",
    "Broncherry": "Mossanda",
    "Broncherry Aqua": "Nitewing",
    "Petallia": "Sweepa",
    "Reptyro": "Astegon",
    "Ice Reptyro": "Cryolinx",
    "Kingpaca": "Beakon",
    "Ice Kingpaca": "Beakon",
    "Mammorest": "Astegon",
    "Mammorest Cryst": "Astegon",
    "Wumpo": "Beakon",
    "Wumpo Botan": "Menasting",
    "Warsect": "Helzephyr",
    "Fenglope": "Azurobe",
    "Felbat": "Grintale",
    "Quivern": "Helzephyr",
    "Blazamut": "Blazamut",
    "Helzephyr": "Cryolinx",
    "Astegon": "Suzaku",
    "Menasting": "Cryolinx",
    "Anubis": "Relaxaurus",
    "Jormuntide": "Astegon",
    "Jormuntide Ignis": "Astegon",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Blazamut",
    "Grizzbolt": "Cryolinx",
    "Lyleen": "Cryolinx",
    "Lyleen Noct": "Cryolinx",
    "Faleris": "Helzephyr",
    "Orserk": "Suzaku",
    "Shadowbeak": "Suzaku",
    "Paladius": "Suzaku",
    "Necromus": "Suzaku",
    "Frostallion": "Suzaku",
    "Frostallion Noct": "Suzaku",
    "Jetragon": "Suzaku"
  },
  "Helzephyr": {
    "Lamball": "Kitsun",
    "Cattiva": "Kitsun",
    "Chikipi": "Digtoise",
    "Lifmunk": "Dinossom",
    "Foxparks": "Arsox",
    "Fuack": "Foxcicle",
    "Sparkit": "Chillet",
    "Tanzee": "Blazehowl",
    "Rooby": "Univolt",
    "Pengullet": "Foxcicle",
    "Penking": "Pyrin",
    "Jolthog": "Petallia",
    "Jolthog Cryst": "Petallia",
    "Gumoss": "Blazehowl",
    "Gumoss (Special)": "Blazehowl",
    "Vixy": "Dinossom",
    "Hoocrates": "Arsox",
    "Teafant": "Digtoise",
    "Depresso": "Arsox",
    "Cremis": "Dinossom",
    "Daedream": "Blazehowl",
    "Rushoar": "Vanwyrm",
    "Nox": "Univolt",
    "Fuddler": "Blazehowl",
    "Killamari": "Rayhound",
    "Mau": "Kitsun",
    "Mau Cryst": "Dinossom",
    "Celaray": "Elphidran",
    "Direhowl": "Bushi",
    "Tocotoco": "Foxcicle",
    "Flopie": "Rayhound",
    "Mozzarina": "Elphidran",
    "Bristla": "Tombat",
    "Gobfin": "Bushi",
    "Gobfin Ignis": "Bushi",
    "Hangyu": "Chillet",
    "Hangyu Cryst": "Chillet",
    "Mossanda": "Jormuntide",
    "Mossanda Lux": "Relaxaurus",
    "Woolipop": "Univolt",
    "Caprity": "Surfent",
    "Melpaca": "Elphidran",
    "Eikthyrdeer": "Surfent",
    "Eikthyrdeer Terra": "Elphidran",
    "Nitewing": "Jormuntide",
    "Ribunny": "Tombat",
    "Incineram": "Ragnahawk",
    "Incineram Noct": "Ragnahawk",
    "Cinnamoth": "Warsect",
    "Arsox": "Cinnamoth",
    "Dumud": "Elphidran",
    "Cawgnito": "Bushi",
    "Leezpunk": "Vanwyrm",
    "Leezpunk Ignis": "Vanwyrm",
    "Loupmoon": "Anubis",
    "Galeclaw": "Incineram",
    "Robinquill": "Incineram",
    "Robinquill Terra": "Incineram",
    "Gorirat": "Incineram",
    "Beegarde": "Bushi",
    "Elizabee": "Menasting",
    "Grintale": "Quivern",
    "Swee": "Tombat",
    "Sweepa": "Mammorest",
    "Chillet": "Azurobe",
    "Univolt": "Mossanda",
    "Foxcicle": "Wumpo Botan",
    "Pyrin": "Relaxaurus",
    "Pyrin Noct": "Beakon",
    "Reindrix": "Elphidran",
    "Rayhound": "Wumpo",
    "Kitsun": "Grintale",
    "Dazzi": "Katress",
    "Lunaris": "Vanwyrm",
    "Dinossom": "Azurobe",
    "Dinossom Lux": "Azurobe",
    "Surfent": "Ragnahawk",
    "Surfent Terra": "Pyrin",
    "Maraith": "Univolt",
    "Digtoise": "Penking",
    "Tombat": "Kingpaca",
    "Lovander": "Anubis",
    "Flambelle": "Chillet",
    "Vanwyrm": "Nitewing",
    "Vanwyrm Cryst": "Sweepa",
    "Bushi": "Nitewing",
    "Beakon": "Beakon",
    "Ragnahawk": "Relaxaurus",
    "Katress": "Sibelyx",
    "Wixen": "Univolt",
    "Verdash": "Incineram",
    "Vaelet": "Bushi",
    "Sibelyx": "Reptyro",
    "Elphidran": "Pyrin",
    "Elphidran Aqua": "Pyrin",
    "Kelpsea": "Rayhound",
    "Kelpsea Ignis": "Rayhound",
    "Azurobe": "Warsect",
    "Cryolinx": "Astegon",
    "Blazehowl": "Sibelyx",
    "Blazehowl Noct": "Mossanda",
    "Relaxaurus": "Beakon",
    "Relaxaurus Lux": "Beakon",
    "Broncherry": "Penking",
    "Broncherry Aqua": "Penking",
    "Petallia": "Wumpo Botan",
    "Reptyro": "Menasting",
    "Ice Reptyro": "Beakon",
    "Kingpaca": "Elizabee",
    "Ice Kingpaca": "Jormuntide",
    "Mammorest": "Menasting",
    "Mammorest Cryst": "Beakon",
    "Wumpo": "Reptyro",
    "Wumpo Botan": "Elizabee",
    "Warsect": "Menasting",
    "Fenglope": "Incineram",
    "Felbat": "Incineram",
    "Quivern": "Relaxaurus",
    "Blazamut": "Cryolinx",
    "Helzephyr": "Helzephyr",
    "Astegon": "Astegon",
    "Menasting": "Beakon",
    "Anubis": "Ragnahawk",
    "Jormuntide": "Menasting",
    "Jormuntide Ignis": "Menasting",
    "Suzaku": "Cryolinx",
    "Suzaku Aqua": "Cryolinx",
    "Grizzbolt": "Helzephyr",
    "Lyleen": "Beakon",
    "Lyleen Noct": "Helzephyr",
    "Faleris": "Relaxaurus",
    "Orserk": "Astegon",
    "Shadowbeak": "Cryolinx",
    "Paladius": "Cryolinx",
    "Necromus": "Cryolinx",
    "Frostallion": "Frostallion Noct",
    "Frostallion Noct": "Astegon",
    "Jetragon": "Cryolinx"
  },
  "Astegon": {
    "Lamball": "Dinossom",
    "Cattiva": "Chillet",
    "Chikipi": "Kitsun",
    "Lifmunk": "Arsox",
    "Foxparks": "Petallia",
    "Fuack": "Rayhound",
    "Sparkit": "Petallia",
    "Tanzee": "Katress",
    "Rooby": "Vanwyrm",
    "Pengullet": "Tombat",
    "Penking": "Elizabee",
    "Jolthog": "Foxcicle",
    "Jolthog Cryst": "Tombat",
    "Gumoss": "Katress",
    "Gumoss (Special)": "Katress",
    "Vixy": "Chillet",
    "Hoocrates": "Foxcicle",
    "Teafant": "Dinossom",
    "Depresso": "Foxcicle",
    "Cremis": "Chillet",
    "Daedream": "Univolt",
    "Rushoar": "Bushi",
    "Nox": "Vanwyrm",
    "Fuddler": "Univolt",
    "Killamari": "Blazehowl",
    "Mau": "Dinossom",
    "Mau Cryst": "Arsox",
    "Celaray": "Grintale",
    "Direhowl": "Incineram",
    "Tocotoco": "Tombat",
    "Flopie": "Blazehowl",
    "Mozzarina": "Elphidran",
    "Bristla": "Rayhound",
    "Gobfin": "Bushi",
    "Gobfin Ignis": "Bushi",
    "Hangyu": "Arsox",
    "Hangyu Cryst": "Arsox",
    "Mossanda": "Relaxaurus",
    "Mossanda Lux": "Relaxaurus",
    "Woolipop": "Univolt",
    "Caprity": "Elphidran",
    "Melpaca": "Penking",
    "Eikthyrdeer": "Elphidran",
    "Eikthyrdeer Terra": "Penking",
    "Nitewing": "Relaxaurus",
    "Ribunny": "Rayhound",
    "Incineram": "Pyrin",
    "Incineram Noct": "Pyrin",
    "Cinnamoth": "Reptyro",
    "Arsox": "Kingpaca",
    "Dumud": "Penking",
    "Cawgnito": "Incineram",
    "Leezpunk": "Bushi",
    "Leezpunk Ignis": "Bushi",
    "Loupmoon": "Elphidran",
    "Galeclaw": "Incineram",
    "Robinquill": "Incineram",
    "Robinquill Terra": "Anubis",
    "Gorirat": "Incineram",
    "Beegarde": "Incineram",
    "Elizabee": "Beakon",
    "Grintale": "Elizabee",
    "Swee": "Rayhound",
    "Sweepa": "Relaxaurus",
    "Chillet": "Wumpo Botan",
    "Univolt": "Nitewing",
    "Foxcicle": "Sibelyx",
    "Pyrin": "Menasting",
    "Pyrin Noct": "Helzephyr",
    "Reindrix": "Penking",
    "Rayhound": "Sibelyx",
    "Kitsun": "Shadowbeak",
    "Dazzi": "Univolt",
    "Lunaris": "Bushi",
    "Dinossom": "Wumpo Botan",
    "Dinossom Lux": "Wumpo Botan",
    "Surfent": "Pyrin",
    "Surfent Terra": "Quivern",
    "Maraith": "Vanwyrm",
    "Digtoise": "Azurobe",
    "Tombat": "Sibelyx",
    "Lovander": "Elphidran",
    "Flambelle": "Petallia",
    "Vanwyrm": "Sweepa",
    "Vanwyrm Cryst": "Ragnahawk",
    "Bushi": "Sweepa",
    "Beakon": "Helzephyr",
    "Ragnahawk": "Menasting",
    "Katress": "Nitewing",
    "Wixen": "Vanwyrm",
    "Verdash": "Anubis",
    "Vaelet": "Incineram",
    "Sibelyx": "Mammorest",
    "Elphidran": "Warsect",
    "Elphidran Aqua": "Warsect",
    "Kelpsea": "Blazehowl",
    "Kelpsea Ignis": "Blazehowl",
    "Azurobe": "Reptyro",
    "Cryolinx": "Cryolinx",
    "Blazehowl": "Mossanda",
    "Blazehowl Noct": "Sweepa",
    "Relaxaurus": "Beakon",
    "Relaxaurus Lux": "Beakon",
    "Broncherry": "Azurobe",
    "Broncherry Aqua": "Azurobe",
    "Petallia": "Wumpo",
    "Reptyro": "Beakon",
    "Ice Reptyro": "Helzephyr",
    "Kingpaca": "Jormuntide",
    "Ice Kingpaca": "Mammorest",
    "Mammorest": "Beakon",
    "Mammorest Cryst": "Beakon",
    "Wumpo": "Jormuntide",
    "Wumpo Botan": "Jormuntide",
    "Warsect": "Menasting",
    "Fenglope": "Anubis",
    "Felbat": "Anubis",
    "Quivern": "Menasting",
    "Blazamut": "Suzaku",
    "Helzephyr": "Astegon",
    "Astegon": "Astegon",
    "Menasting": "Beakon",
    "Anubis": "Pyrin",
    "Jormuntide": "Beakon",
    "Jormuntide Ignis": "Beakon",
    "Suzaku": "Cryolinx",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Helzephyr",
    "Lyleen": "Helzephyr",
    "Lyleen Noct": "Helzephyr",
    "Faleris": "Menasting",
    "Orserk": "Astegon",
    "Shadowbeak": "Cryolinx",
    "Paladius": "Cryolinx",
    "Necromus": "Cryolinx",
    "Frostallion": "Cryolinx",
    "Frostallion Noct": "Cryolinx",
    "Jetragon": "Cryolinx"
  },
  "Menasting": {
    "Lamball": "Broncherry",
    "Cattiva": "Broncherry",
    "Chikipi": "Reindrix",
    "Lifmunk": "Digtoise",
    "Foxparks": "Kitsun",
    "Fuack": "Arsox",
    "Sparkit": "Kitsun",
    "Tanzee": "Tombat",
    "Rooby": "Blazehowl",
    "Pengullet": "Chillet",
    "Penking": "Ragnahawk",
    "Jolthog": "Dinossom",
    "Jolthog Cryst": "Dinossom",
    "Gumoss": "Tombat",
    "Gumoss (Special)": "Tombat",
    "Vixy": "Digtoise",
    "Hoocrates": "Kitsun",
    "Teafant": "Reindrix",
    "Depresso": "Dinossom",
    "Cremis": "Broncherry",
    "Daedream": "Tombat",
    "Rushoar": "Katress",
    "Nox": "Blazehowl",
    "Fuddler": "Rayhound",
    "Killamari": "Petallia",
    "Mau": "Celaray",
    "Mau Cryst": "Digtoise",
    "Celaray": "Anubis",
    "Direhowl": "Vanwyrm",
    "Tocotoco": "Chillet",
    "Flopie": "Foxcicle",
    "Mozzarina": "Incineram",
    "Bristla": "Arsox",
    "Gobfin": "Univolt",
    "Gobfin Ignis": "Univolt",
    "Hangyu": "Digtoise",
    "Hangyu Cryst": "Digtoise",
    "Mossanda": "Warsect",
    "Mossanda Lux": "Reptyro",
    "Woolipop": "Rayhound",
    "Caprity": "Incineram",
    "Melpaca": "Anubis",
    "Eikthyrdeer": "Incineram",
    "Eikthyrdeer Terra": "Anubis",
    "Nitewing": "Warsect",
    "Ribunny": "Arsox",
    "Incineram": "Nitewing",
    "Incineram Noct": "Nitewing",
    "Cinnamoth": "Ragnahawk",
    "Arsox": "Penking",
    "Dumud": "Anubis",
    "Cawgnito": "Univolt",
    "Leezpunk": "Univolt",
    "Leezpunk Ignis": "Katress",
    "Loupmoon": "Incineram",
    "Galeclaw": "Bushi",
    "Robinquill": "Bushi",
    "Robinquill Terra": "Bushi",
    "Gorirat": "Vanwyrm",
    "Beegarde": "Vanwyrm",
    "Elizabee": "Mammorest",
    "Grintale": "Ragnahawk",
    "Swee": "Petallia",
    "Sweepa": "Elizabee",
    "Chillet": "Elphidran",
    "Univolt": "Kingpaca",
    "Foxcicle": "Grintale",
    "Pyrin": "Jormuntide",
    "Pyrin Noct": "Menasting",
    "Reindrix": "Anubis",
    "Rayhound": "Azurobe",
    "Kitsun": "Elphidran",
    "Dazzi": "Rayhound",
    "Lunaris": "Univolt",
    "Dinossom": "Elphidran",
    "Dinossom Lux": "Elphidran",
    "Surfent": "Sweepa",
    "Surfent Terra": "Sweepa",
    "Maraith": "Blazehowl",
    "Digtoise": "Surfent",
    "Tombat": "Azurobe",
    "Lovander": "Incineram",
    "Flambelle": "Kitsun",
    "Vanwyrm": "Wumpo",
    "Vanwyrm Cryst": "Sibelyx",
    "Bushi": "Sibelyx",
    "Beakon": "Beakon",
    "Ragnahawk": "Reptyro",
    "Katress": "Wumpo Botan",
    "Wixen": "Blazehowl",
    "Verdash": "Bushi",
    "Vaelet": "Vanwyrm",
    "Sibelyx": "Pyrin",
    "Elphidran": "Sweepa",
    "Elphidran Aqua": "Sweepa",
    "Kelpsea": "Foxcicle",
    "Kelpsea Ignis": "Foxcicle",
    "Azurobe": "Ragnahawk",
    "Cryolinx": "Helzephyr",
    "Blazehowl": "Wumpo Botan",
    "Blazehowl Noct": "Wumpo",
    "Relaxaurus": "Relaxaurus",
    "Relaxaurus Lux": "Menasting",
    "Broncherry": "Surfent",
    "Broncherry Aqua": "Elphidran",
    "Petallia": "Penking",
    "Reptyro": "Relaxaurus",
    "Ice Reptyro": "Menasting",
    "Kingpaca": "Pyrin",
    "Ice Kingpaca": "Quivern",
    "Mammorest": "Relaxaurus",
    "Mammorest Cryst": "Relaxaurus",
    "Wumpo": "Pyrin",
    "Wumpo Botan": "Pyrin",
    "Warsect": "Mammorest",
    "Fenglope": "Bushi",
    "Felbat": "Bushi",
    "Quivern": "Jormuntide",
    "Blazamut": "Cryolinx",
    "Helzephyr": "Beakon",
    "Astegon": "Beakon",
    "Menasting": "Menasting",
    "Anubis": "Nitewing",
    "Jormuntide": "Relaxaurus",
    "Jormuntide Ignis": "Relaxaurus",
    "Suzaku": "Astegon",
    "Suzaku Aqua": "Astegon",
    "Grizzbolt": "Beakon",
    "Lyleen": "Lyleen Noct",
    "Lyleen Noct": "Beakon",
    "Faleris": "Jormuntide",
    "Orserk": "Helzephyr",
    "Shadowbeak": "Astegon",
    "Paladius": "Astegon",
    "Necromus": "Astegon",
    "Frostallion": "Helzephyr",
    "Frostallion Noct": "Helzephyr",
    "Jetragon": "Helzephyr"
  },
  "Anubis": {
    "Lamball": "Robinquill",
    "Cattiva": "Robinquill",
    "Chikipi": "Galeclaw",
    "Lifmunk": "Felbat",
    "Foxparks": "Fenglope",
    "Fuack": "Loupmoon",
    "Sparkit": "Verdash",
    "Tanzee": "Mozzarina",
    "Rooby": "Broncherry",
    "Pengullet": "Loupmoon",
    "Penking": "Elphidran",
    "Jolthog": "Fenglope",
    "Jolthog Cryst": "Loupmoon",
    "Gumoss": "Mozzarina",
    "Gumoss (Special)": "Mozzarina",
    "Vixy": "Felbat",
    "Hoocrates": "Fenglope",
    "Teafant": "Galeclaw",
    "Depresso": "Fenglope",
    "Cremis": "Felbat",
    "Daedream": "Dumud",
    "Rushoar": "Digtoise",
    "Nox": "Reindrix",
    "Fuddler": "Dumud",
    "Killamari": "Caprity",
    "Mau": "Galeclaw",
    "Mau Cryst": "Felbat",
    "Celaray": "Blazehowl",
    "Direhowl": "Dinossom",
    "Tocotoco": "Loupmoon",
    "Flopie": "Eikthyrdeer",
    "Mozzarina": "Rayhound",
    "Bristla": "Loupmoon",
    "Gobfin": "Kitsun",
    "Gobfin Ignis": "Kitsun",
    "Hangyu": "Verdash",
    "Hangyu Cryst": "Verdash",
    "Mossanda": "Azurobe",
    "Mossanda Lux": "Wumpo Botan",
    "Woolipop": "Reindrix",
    "Caprity": "Tombat",
    "Melpaca": "Rayhound",
    "Eikthyrdeer": "Tombat",
    "Eikthyrdeer Terra": "Rayhound",
    "Nitewing": "Azurobe",
    "Ribunny": "Lovander",
    "Incineram": "Anubis",
    "Incineram Noct": "Anubis",
    "Cinnamoth": "Elphidran",
    "Arsox": "Univolt",
    "Dumud": "Rayhound",
    "Cawgnito": "Kitsun",
    "Leezpunk": "Digtoise",
    "Leezpunk Ignis": "Digtoise",
    "Loupmoon": "Foxcicle",
    "Galeclaw": "Chillet",
    "Robinquill": "Arsox",
    "Robinquill Terra": "Arsox",
    "Gorirat": "Chillet",
    "Beegarde": "Dinossom",
    "Elizabee": "Sibelyx",
    "Grintale": "Elphidran",
    "Swee": "Caprity",
    "Sweepa": "Cinnamoth",
    "Chillet": "Univolt",
    "Univolt": "Bushi",
    "Foxcicle": "Vanwyrm",
    "Pyrin": "Wumpo",
    "Pyrin Noct": "Sweepa",
    "Reindrix": "Rayhound",
    "Rayhound": "Vanwyrm",
    "Kitsun": "Katress",
    "Dazzi": "Melpaca",
    "Lunaris": "Digtoise",
    "Dinossom": "Katress",
    "Dinossom Lux": "Univolt",
    "Surfent": "Anubis",
    "Surfent Terra": "Surfent",
    "Maraith": "Broncherry",
    "Digtoise": "Blazehowl",
    "Tombat": "Vanwyrm",
    "Lovander": "Tombat",
    "Flambelle": "Verdash",
    "Vanwyrm": "Faleris",
    "Vanwyrm Cryst": "Incineram",
    "Bushi": "Incineram",
    "Beakon": "Sweepa",
    "Ragnahawk": "Wumpo Botan",
    "Katress": "Bushi",
    "Wixen": "Broncherry",
    "Verdash": "Petallia",
    "Vaelet": "Dinossom",
    "Sibelyx": "Grintale",
    "Elphidran": "Surfent",
    "Elphidran Aqua": "Elphidran",
    "Kelpsea": "Eikthyrdeer",
    "Kelpsea Ignis": "Eikthyrdeer",
    "Azurobe": "Elphidran",
    "Cryolinx": "Quivern",
    "Blazehowl": "Bushi",
    "Blazehowl Noct": "Bushi",
    "Relaxaurus": "Nitewing",
    "Relaxaurus Lux": "Nitewing",
    "Broncherry": "Blazehowl",
    "Broncherry Aqua": "Blazehowl",
    "Petallia": "Univolt",
    "Reptyro": "Sibelyx",
    "Ice Reptyro": "Sweepa",
    "Kingpaca": "Penking",
    "Ice Kingpaca": "Azurobe",
    "Mammorest": "Mossanda",
    "Mammorest Cryst": "Mossanda",
    "Wumpo": "Penking",
    "Wumpo Botan": "Penking",
    "Warsect": "Sibelyx",
    "Fenglope": "Petallia",
    "Felbat": "Arsox",
    "Quivern": "Wumpo",
    "Blazamut": "Relaxaurus",
    "Helzephyr": "Ragnahawk",
    "Astegon": "Pyrin",
    "Menasting": "Nitewing",
    "Anubis": "Anubis",
    "Jormuntide": "Sibelyx",
    "Jormuntide Ignis": "Sibelyx",
    "Suzaku": "Jormuntide",
    "Suzaku Aqua": "Mammorest",
    "Grizzbolt": "Ragnahawk",
    "Lyleen": "Sweepa",
    "Lyleen Noct": "Ragnahawk",
    "Faleris": "Kingpaca",
    "Orserk": "Pyrin",
    "Shadowbeak": "Jormuntide",
    "Paladius": "Reptyro",
    "Necromus": "Reptyro",
    "Frostallion": "Warsect",
    "Frostallion Noct": "Elizabee",
    "Jetragon": "Elizabee"
  },
  "Jormuntide": {
    "Lamball": "Melpaca",
    "Cattiva": "Melpaca",
    "Chikipi": "Mozzarina",
    "Lifmunk": "Celaray",
    "Foxparks": "Digtoise",
    "Fuack": "Dinossom",
    "Sparkit": "Broncherry",
    "Tanzee": "Petallia",
    "Rooby": "Rayhound",
    "Pengullet": "Kitsun",
    "Penking": "Nitewing",
    "Jolthog": "Digtoise",
    "Jolthog Cryst": "Kitsun",
    "Gumoss": "Petallia",
    "Gumoss (Special)": "Petallia",
    "Vixy": "Reindrix",
    "Hoocrates": "Digtoise",
    "Teafant": "Dumud",
    "Depresso": "Digtoise",
    "Cremis": "Reindrix",
    "Daedream": "Foxcicle",
    "Rushoar": "Blazehowl",
    "Nox": "Tombat",
    "Fuddler": "Foxcicle",
    "Killamari": "Chillet",
    "Mau": "Dumud",
    "Mau Cryst": "Reindrix",
    "Celaray": "Incineram",
    "Direhowl": "Univolt",
    "Tocotoco": "Kitsun",
    "Flopie": "Arsox",
    "Mozzarina": "Incineram",
    "Bristla": "Dinossom",
    "Gobfin": "Katress",
    "Gobfin Ignis": "Blazehowl",
    "Hangyu": "Broncherry",
    "Hangyu Cryst": "Celaray",
    "Mossanda": "Pyrin",
    "Mossanda Lux": "Quivern",
    "Woolipop": "Tombat",
    "Caprity": "Bushi",
    "Melpaca": "Incineram",
    "Eikthyrdeer": "Incineram",
    "Eikthyrdeer Terra": "Incineram",
    "Nitewing": "Pyrin",
    "Ribunny": "Dinossom",
    "Incineram": "Sibelyx",
    "Incineram Noct": "Sibelyx",
    "Cinnamoth": "Sweepa",
    "Arsox": "Elphidran",
    "Dumud": "Incineram",
    "Cawgnito": "Katress",
    "Leezpunk": "Blazehowl",
    "Leezpunk Ignis": "Rayhound",
    "Loupmoon": "Bushi",
    "Galeclaw": "Univolt",
    "Robinquill": "Vanwyrm",
    "Robinquill Terra": "Vanwyrm",
    "Gorirat": "Univolt",
    "Beegarde": "Univolt",
    "Elizabee": "Reptyro",
    "Grintale": "Sweepa",
    "Swee": "Chillet",
    "Sweepa": "Pyrin",
    "Chillet": "Surfent",
    "Univolt": "Azurobe",
    "Foxcicle": "Elphidran",
    "Pyrin": "Elizabee",
    "Pyrin Noct": "Relaxaurus",
    "Reindrix": "Incineram",
    "Rayhound": "Penking",
    "Kitsun": "Anubis",
    "Dazzi": "Foxcicle",
    "Lunaris": "Blazehowl",
    "Dinossom": "Anubis",
    "Dinossom Lux": "Surfent",
    "Surfent": "Mossanda",
    "Surfent Terra": "Mossanda",
    "Maraith": "Rayhound",
    "Digtoise": "Anubis",
    "Tombat": "Elphidran",
    "Lovander": "Bushi",
    "Flambelle": "Broncherry",
    "Vanwyrm": "Wumpo Botan",
    "Vanwyrm Cryst": "Wumpo",
    "Bushi": "Wumpo Botan",
    "Beakon": "Menasting",
    "Ragnahawk": "Warsect",
    "Katress": "Azurobe",
    "Wixen": "Rayhound",
    "Verdash": "Vanwyrm",
    "Vaelet": "Univolt",
    "Sibelyx": "Ragnahawk",
    "Elphidran": "Nitewing",
    "Elphidran Aqua": "Nitewing",
    "Kelpsea": "Arsox",
    "Kelpsea Ignis": "Arsox",
    "Azurobe": "Sweepa",
    "Cryolinx": "Beakon",
    "Blazehowl": "Grintale",
    "Blazehowl Noct": "Cinnamoth",
    "Relaxaurus": "Mammorest",
    "Relaxaurus Lux": "Relaxaurus",
    "Broncherry": "Incineram",
    "Broncherry Aqua": "Anubis",
    "Petallia": "Elphidran",
    "Reptyro": "Jormuntide",
    "Ice Reptyro": "Relaxaurus",
    "Kingpaca": "Ragnahawk",
    "Ice Kingpaca": "Ragnahawk",
    "Mammorest": "Jormuntide",
    "Mammorest Cryst": "Mammorest",
    "Wumpo": "Ragnahawk",
    "Wumpo Botan": "Sweepa",
    "Warsect": "Reptyro",
    "Fenglope": "Bushi",
    "Felbat": "Vanwyrm",
    "Quivern": "Elizabee",
    "Blazamut": "Astegon",
    "Helzephyr": "Menasting",
    "Astegon": "Beakon",
    "Menasting": "Relaxaurus",
    "Anubis": "Sibelyx",
    "Jormuntide": "Jormuntide",
    "Jormuntide Ignis": "Jormuntide",
    "Suzaku": "Suzaku Aqua",
    "Suzaku Aqua": "Astegon",
    "Grizzbolt": "Menasting",
    "Lyleen": "Relaxaurus",
    "Lyleen Noct": "Menasting",
    "Faleris": "Warsect",
    "Orserk": "Beakon",
    "Shadowbeak": "Helzephyr",
    "Paladius": "Helzephyr",
    "Necromus": "Helzephyr",
    "Frostallion": "Beakon",
    "Frostallion Noct": "Beakon",
    "Jetragon": "Helzephyr"
  },
  "Jormuntide Ignis": {
    "variant": true,
    "Lamball": "Dumud",
    "Cattiva": "Melpaca",
    "Chikipi": "Mozzarina",
    "Lifmunk": "Celaray",
    "Foxparks": "Broncherry",
    "Fuack": "Dinossom",
    "Sparkit": "Broncherry",
    "Tanzee": "Petallia",
    "Rooby": "Rayhound",
    "Pengullet": "Kitsun",
    "Penking": "Nitewing",
    "Jolthog": "Digtoise",
    "Jolthog Cryst": "Kitsun",
    "Gumoss": "Petallia",
    "Gumoss (Special)": "Petallia",
    "Vixy": "Reindrix",
    "Hoocrates": "Digtoise",
    "Teafant": "Mozzarina",
    "Depresso": "Digtoise",
    "Cremis": "Melpaca",
    "Daedream": "Petallia",
    "Rushoar": "Blazehowl",
    "Nox": "Tombat",
    "Fuddler": "Foxcicle",
    "Killamari": "Chillet",
    "Mau": "Dumud",
    "Mau Cryst": "Reindrix",
    "Celaray": "Incineram",
    "Direhowl": "Univolt",
    "Tocotoco": "Kitsun",
    "Flopie": "Chillet",
    "Mozzarina": "Incineram",
    "Bristla": "Dinossom",
    "Gobfin": "Katress",
    "Gobfin Ignis": "Blazehowl",
    "Hangyu": "Celaray",
    "Hangyu Cryst": "Celaray",
    "Mossanda": "Ragnahawk",
    "Mossanda Lux": "Quivern",
    "Woolipop": "Tombat",
    "Caprity": "Bushi",
    "Melpaca": "Incineram",
    "Eikthyrdeer": "Bushi",
    "Eikthyrdeer Terra": "Incineram",
    "Nitewing": "Pyrin",
    "Ribunny": "Dinossom",
    "Incineram": "Sibelyx",
    "Incineram Noct": "Sibelyx",
    "Cinnamoth": "Sweepa",
    "Arsox": "Surfent",
    "Dumud": "Incineram",
    "Cawgnito": "Katress",
    "Leezpunk": "Blazehowl",
    "Leezpunk Ignis": "Rayhound",
    "Loupmoon": "Bushi",
    "Galeclaw": "Univolt",
    "Robinquill": "Vanwyrm",
    "Robinquill Terra": "Vanwyrm",
    "Gorirat": "Univolt",
    "Beegarde": "Katress",
    "Elizabee": "Reptyro",
    "Grintale": "Sweepa",
    "Swee": "Chillet",
    "Sweepa": "Pyrin",
    "Chillet": "Surfent",
    "Univolt": "Azurobe",
    "Foxcicle": "Elphidran",
    "Pyrin": "Warsect",
    "Pyrin Noct": "Relaxaurus",
    "Reindrix": "Incineram",
    "Rayhound": "Penking",
    "Kitsun": "Anubis",
    "Dazzi": "Foxcicle",
    "Lunaris": "Blazehowl",
    "Dinossom": "Anubis",
    "Dinossom Lux": "Surfent",
    "Surfent": "Mossanda",
    "Surfent Terra": "Mossanda",
    "Maraith": "Rayhound",
    "Digtoise": "Incineram",
    "Tombat": "Elphidran",
    "Lovander": "Bushi",
    "Flambelle": "Broncherry",
    "Vanwyrm": "Cinnamoth",
    "Vanwyrm Cryst": "Kingpaca",
    "Bushi": "Wumpo Botan",
    "Beakon": "Menasting",
    "Ragnahawk": "Quivern",
    "Katress": "Grintale",
    "Wixen": "Rayhound",
    "Verdash": "Vanwyrm",
    "Vaelet": "Univolt",
    "Sibelyx": "Ragnahawk",
    "Elphidran": "Mossanda",
    "Elphidran Aqua": "Nitewing",
    "Kelpsea": "Arsox",
    "Kelpsea Ignis": "Arsox",
    "Azurobe": "Sweepa",
    "Cryolinx": "Beakon",
    "Blazehowl": "Grintale",
    "Blazehowl Noct": "Cinnamoth",
    "Relaxaurus": "Mammorest",
    "Relaxaurus Lux": "Mammorest",
    "Broncherry": "Incineram",
    "Broncherry Aqua": "Anubis",
    "Petallia": "Elphidran",
    "Reptyro": "Reptyro",
    "Ice Reptyro": "Relaxaurus",
    "Kingpaca": "Ragnahawk",
    "Ice Kingpaca": "Ragnahawk",
    "Mammorest": "Jormuntide",
    "Mammorest Cryst": "Mammorest",
    "Wumpo": "Ragnahawk",
    "Wumpo Botan": "Sweepa",
    "Warsect": "Elizabee",
    "Fenglope": "Bushi",
    "Felbat": "Vanwyrm",
    "Quivern": "Elizabee",
    "Blazamut": "Astegon",
    "Helzephyr": "Menasting",
    "Astegon": "Beakon",
    "Menasting": "Relaxaurus",
    "Anubis": "Sibelyx",
    "Jormuntide": "Jormuntide",
    "Jormuntide Ignis": "Jormuntide Ignis",
    "Suzaku": "Helzephyr",
    "Suzaku Aqua": "Helzephyr",
    "Grizzbolt": "Menasting",
    "Lyleen": "Relaxaurus",
    "Lyleen Noct": "Menasting",
    "Faleris": "Warsect",
    "Orserk": "Beakon",
    "Shadowbeak": "Helzephyr",
    "Paladius": "Helzephyr",
    "Necromus": "Helzephyr",
    "Frostallion": "Beakon",
    "Frostallion Noct": "Beakon",
    "Jetragon": "Helzephyr"
  },
  "Suzaku": {
    "Lamball": "Foxcicle",
    "Cattiva": "Tombat",
    "Chikipi": "Petallia",
    "Lifmunk": "Rayhound",
    "Foxparks": "Rayhound",
    "Fuack": "Univolt",
    "Sparkit": "Rayhound",
    "Tanzee": "Vanwyrm",
    "Rooby": "Incineram",
    "Pengullet": "Katress",
    "Penking": "Relaxaurus",
    "Jolthog": "Blazehowl",
    "Jolthog Cryst": "Blazehowl",
    "Gumoss": "Bushi",
    "Gumoss (Special)": "Bushi",
    "Vixy": "Tombat",
    "Hoocrates": "Blazehowl",
    "Teafant": "Foxcicle",
    "Depresso": "Blazehowl",
    "Cremis": "Tombat",
    "Daedream": "Bushi",
    "Rushoar": "Incineram",
    "Nox": "Incineram",
    "Fuddler": "Bushi",
    "Killamari": "Univolt",
    "Mau": "Foxcicle",
    "Mau Cryst": "Tombat",
    "Celaray": "Wumpo",
    "Direhowl": "Surfent",
    "Tocotoco": "Katress",
    "Flopie": "Vanwyrm",
    "Mozzarina": "Wumpo Botan",
    "Bristla": "Univolt",
    "Gobfin": "Anubis",
    "Gobfin Ignis": "Anubis",
    "Hangyu": "Rayhound",
    "Hangyu Cryst": "Rayhound",
    "Mossanda": "Beakon",
    "Mossanda Lux": "Beakon",
    "Woolipop": "Bushi",
    "Caprity": "Cinnamoth",
    "Melpaca": "Kingpaca",
    "Eikthyrdeer": "Wumpo Botan",
    "Eikthyrdeer Terra": "Wumpo Botan",
    "Nitewing": "Beakon",
    "Ribunny": "Univolt",
    "Incineram": "Reptyro",
    "Incineram Noct": "Jormuntide",
    "Cinnamoth": "Relaxaurus",
    "Arsox": "Nitewing",
    "Dumud": "Kingpaca",
    "Cawgnito": "Anubis",
    "Leezpunk": "Incineram",
    "Leezpunk Ignis": "Incineram",
    "Loupmoon": "Azurobe",
    "Galeclaw": "Elphidran",
    "Robinquill": "Elphidran",
    "Robinquill Terra": "Penking",
    "Gorirat": "Elphidran",
    "Beegarde": "Surfent",
    "Elizabee": "Helzephyr",
    "Grintale": "Relaxaurus",
    "Swee": "Univolt",
    "Sweepa": "Beakon",
    "Chillet": "Nitewing",
    "Univolt": "Pyrin",
    "Foxcicle": "Sweepa",
    "Pyrin": "Beakon",
    "Pyrin Noct": "Astegon",
    "Reindrix": "Wumpo",
    "Rayhound": "Sweepa",
    "Kitsun": "Sibelyx",
    "Dazzi": "Bushi",
    "Lunaris": "Anubis",
    "Dinossom": "Mossanda",
    "Dinossom Lux": "Mossanda",
    "Surfent": "Jormuntide",
    "Surfent Terra": "Mammorest",
    "Maraith": "Incineram",
    "Digtoise": "Sibelyx",
    "Tombat": "Sweepa",
    "Lovander": "Azurobe",
    "Flambelle": "Rayhound",
    "Vanwyrm": "Pyrin",
    "Vanwyrm Cryst": "Elizabee",
    "Bushi": "Warsect",
    "Beakon": "Cryolinx",
    "Ragnahawk": "Beakon",
    "Katress": "Ragnahawk",
    "Wixen": "Incineram",
    "Verdash": "Penking",
    "Vaelet": "Elphidran",
    "Sibelyx": "Menasting",
    "Elphidran": "Mammorest",
    "Elphidran Aqua": "Relaxaurus",
    "Kelpsea": "Vanwyrm",
    "Kelpsea Ignis": "Vanwyrm",
    "Azurobe": "Relaxaurus",
    "Cryolinx": "Suzaku",
    "Blazehowl": "Ragnahawk",
    "Blazehowl Noct": "Pyrin",
    "Relaxaurus": "Astegon",
    "Relaxaurus Lux": "Astegon",
    "Broncherry": "Sibelyx",
    "Broncherry Aqua": "Sibelyx",
    "Petallia": "Nitewing",
    "Reptyro": "Helzephyr",
    "Ice Reptyro": "Cryolinx",
    "Kingpaca": "Menasting",
    "Ice Kingpaca": "Menasting",
    "Mammorest": "Helzephyr",
    "Mammorest Cryst": "Astegon",
    "Wumpo": "Menasting",
    "Wumpo Botan": "Menasting",
    "Warsect": "Helzephyr",
    "Fenglope": "Penking",
    "Felbat": "Elphidran",
    "Quivern": "Helzephyr",
    "Blazamut": "Suzaku",
    "Helzephyr": "Cryolinx",
    "Astegon": "Cryolinx",
    "Menasting": "Astegon",
    "Anubis": "Jormuntide",
    "Jormuntide": "Suzaku Aqua",
    "Jormuntide Ignis": "Helzephyr",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Cryolinx",
    "Lyleen": "Astegon",
    "Lyleen Noct": "Cryolinx",
    "Faleris": "Beakon",
    "Orserk": "Cryolinx",
    "Shadowbeak": "Suzaku",
    "Paladius": "Suzaku",
    "Necromus": "Suzaku",
    "Frostallion": "Suzaku",
    "Frostallion Noct": "Suzaku",
    "Jetragon": "Suzaku"
  },
  "Suzaku Aqua": {
    "variant": true,
    "Lamball": "Tombat",
    "Cattiva": "Tombat",
    "Chikipi": "Foxcicle",
    "Lifmunk": "Rayhound",
    "Foxparks": "Blazehowl",
    "Fuack": "Univolt",
    "Sparkit": "Blazehowl",
    "Tanzee": "Bushi",
    "Rooby": "Incineram",
    "Pengullet": "Univolt",
    "Penking": "Relaxaurus",
    "Jolthog": "Katress",
    "Jolthog Cryst": "Katress",
    "Gumoss": "Bushi",
    "Gumoss (Special)": "Bushi",
    "Vixy": "Rayhound",
    "Hoocrates": "Blazehowl",
    "Teafant": "Foxcicle",
    "Depresso": "Blazehowl",
    "Cremis": "Rayhound",
    "Daedream": "Bushi",
    "Rushoar": "Anubis",
    "Nox": "Incineram",
    "Fuddler": "Bushi",
    "Killamari": "Vanwyrm",
    "Mau": "Tombat",
    "Mau Cryst": "Rayhound",
    "Celaray": "Sibelyx",
    "Direhowl": "Elphidran",
    "Tocotoco": "Univolt",
    "Flopie": "Vanwyrm",
    "Mozzarina": "Kingpaca",
    "Bristla": "Univolt",
    "Gobfin": "Surfent",
    "Gobfin Ignis": "Anubis",
    "Hangyu": "Rayhound",
    "Hangyu Cryst": "Rayhound",
    "Mossanda": "Beakon",
    "Mossanda Lux": "Beakon",
    "Woolipop": "Incineram",
    "Caprity": "Wumpo Botan",
    "Melpaca": "Wumpo",
    "Eikthyrdeer": "Wumpo Botan",
    "Eikthyrdeer Terra": "Wumpo",
    "Nitewing": "Beakon",
    "Ribunny": "Univolt",
    "Incineram": "Jormuntide",
    "Incineram Noct": "Jormuntide",
    "Cinnamoth": "Menasting",
    "Arsox": "Sweepa",
    "Dumud": "Wumpo",
    "Cawgnito": "Surfent",
    "Leezpunk": "Anubis",
    "Leezpunk Ignis": "Incineram",
    "Loupmoon": "Cinnamoth",
    "Galeclaw": "Elphidran",
    "Robinquill": "Penking",
    "Robinquill Terra": "Penking",
    "Gorirat": "Elphidran",
    "Beegarde": "Elphidran",
    "Elizabee": "Helzephyr",
    "Grintale": "Relaxaurus",
    "Swee": "Vanwyrm",
    "Sweepa": "Beakon",
    "Chillet": "Nitewing",
    "Univolt": "Pyrin",
    "Foxcicle": "Sweepa",
    "Pyrin": "Helzephyr",
    "Pyrin Noct": "Cryolinx",
    "Reindrix": "Sibelyx",
    "Rayhound": "Ragnahawk",
    "Kitsun": "Mossanda",
    "Dazzi": "Bushi",
    "Lunaris": "Anubis",
    "Dinossom": "Nitewing",
    "Dinossom Lux": "Nitewing",
    "Surfent": "Mammorest",
    "Surfent Terra": "Relaxaurus",
    "Maraith": "Incineram",
    "Digtoise": "Sibelyx",
    "Tombat": "Ragnahawk",
    "Lovander": "Wumpo Botan",
    "Flambelle": "Blazehowl",
    "Vanwyrm": "Warsect",
    "Vanwyrm Cryst": "Reptyro",
    "Bushi": "Elizabee",
    "Beakon": "Cryolinx",
    "Ragnahawk": "Beakon",
    "Katress": "Pyrin",
    "Wixen": "Incineram",
    "Verdash": "Grintale",
    "Vaelet": "Elphidran",
    "Sibelyx": "Beakon",
    "Elphidran": "Relaxaurus",
    "Elphidran Aqua": "Relaxaurus",
    "Kelpsea": "Bushi",
    "Kelpsea Ignis": "Vanwyrm",
    "Azurobe": "Menasting",
    "Cryolinx": "Suzaku",
    "Blazehowl": "Pyrin",
    "Blazehowl Noct": "Quivern",
    "Relaxaurus": "Astegon",
    "Relaxaurus Lux": "Astegon",
    "Broncherry": "Sibelyx",
    "Broncherry Aqua": "Mossanda",
    "Petallia": "Sweepa",
    "Reptyro": "Helzephyr",
    "Ice Reptyro": "Cryolinx",
    "Kingpaca": "Menasting",
    "Ice Kingpaca": "Beakon",
    "Mammorest": "Astegon",
    "Mammorest Cryst": "Astegon",
    "Wumpo": "Menasting",
    "Wumpo Botan": "Menasting",
    "Warsect": "Helzephyr",
    "Fenglope": "Azurobe",
    "Felbat": "Penking",
    "Quivern": "Helzephyr",
    "Blazamut": "Blazamut",
    "Helzephyr": "Cryolinx",
    "Astegon": "Suzaku",
    "Menasting": "Astegon",
    "Anubis": "Mammorest",
    "Jormuntide": "Astegon",
    "Jormuntide Ignis": "Helzephyr",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Suzaku Aqua",
    "Grizzbolt": "Cryolinx",
    "Lyleen": "Cryolinx",
    "Lyleen Noct": "Cryolinx",
    "Faleris": "Helzephyr",
    "Orserk": "Suzaku",
    "Shadowbeak": "Suzaku",
    "Paladius": "Suzaku",
    "Necromus": "Suzaku",
    "Frostallion": "Suzaku",
    "Frostallion Noct": "Suzaku",
    "Jetragon": "Suzaku"
  },
  "Grizzbolt": {
    "Lamball": "Kitsun",
    "Cattiva": "Kitsun",
    "Chikipi": "Digtoise",
    "Lifmunk": "Dinossom",
    "Foxparks": "Chillet",
    "Fuack": "Foxcicle",
    "Sparkit": "Chillet",
    "Tanzee": "Rayhound",
    "Rooby": "Univolt",
    "Pengullet": "Petallia",
    "Penking": "Pyrin",
    "Jolthog": "Arsox",
    "Jolthog Cryst": "Petallia",
    "Gumoss": "Blazehowl",
    "Gumoss (Special)": "Blazehowl",
    "Vixy": "Kitsun",
    "Hoocrates": "Arsox",
    "Teafant": "Digtoise",
    "Depresso": "Arsox",
    "Cremis": "Kitsun",
    "Daedream": "Blazehowl",
    "Rushoar": "Vanwyrm",
    "Nox": "Univolt",
    "Fuddler": "Blazehowl",
    "Killamari": "Tombat",
    "Mau": "Digtoise",
    "Mau Cryst": "Dinossom",
    "Celaray": "Elphidran",
    "Direhowl": "Bushi",
    "Tocotoco": "Foxcicle",
    "Flopie": "Rayhound",
    "Mozzarina": "Surfent",
    "Bristla": "Foxcicle",
    "Gobfin": "Bushi",
    "Gobfin Ignis": "Vanwyrm",
    "Hangyu": "Dinossom",
    "Hangyu Cryst": "Dinossom",
    "Mossanda": "Mossanda Lux",
    "Mossanda Lux": "Mammorest",
    "Woolipop": "Katress",
    "Caprity": "Anubis",
    "Melpaca": "Elphidran",
    "Eikthyrdeer": "Surfent",
    "Eikthyrdeer Terra": "Elphidran",
    "Nitewing": "Jormuntide",
    "Ribunny": "Tombat",
    "Incineram": "Sweepa",
    "Incineram Noct": "Ragnahawk",
    "Cinnamoth": "Warsect",
    "Arsox": "Azurobe",
    "Dumud": "Elphidran",
    "Cawgnito": "Bushi",
    "Leezpunk": "Vanwyrm",
    "Leezpunk Ignis": "Univolt",
    "Loupmoon": "Anubis",
    "Galeclaw": "Incineram",
    "Robinquill": "Incineram",
    "Robinquill Terra": "Incineram",
    "Gorirat": "Bushi",
    "Beegarde": "Bushi",
    "Elizabee": "Menasting",
    "Grintale": "Pyrin",
    "Swee": "Tombat",
    "Sweepa": "Jormuntide",
    "Chillet": "Azurobe",
    "Univolt": "Sibelyx",
    "Foxcicle": "Wumpo Botan",
    "Pyrin": "Relaxaurus",
    "Pyrin Noct": "Beakon",
    "Reindrix": "Elphidran",
    "Rayhound": "Kingpaca",
    "Kitsun": "Penking",
    "Dazzi": "Blazehowl",
    "Lunaris": "Vanwyrm",
    "Dinossom": "Grintale",
    "Dinossom Lux": "Azurobe",
    "Surfent": "Ragnahawk",
    "Surfent Terra": "Ragnahawk",
    "Maraith": "Univolt",
    "Digtoise": "Penking",
    "Tombat": "Wumpo Botan",
    "Lovander": "Anubis",
    "Flambelle": "Chillet",
    "Vanwyrm": "Mossanda",
    "Vanwyrm Cryst": "Sweepa",
    "Bushi": "Nitewing",
    "Beakon": "Beakon",
    "Ragnahawk": "Relaxaurus",
    "Katress": "Sibelyx",
    "Wixen": "Univolt",
    "Verdash": "Incineram",
    "Vaelet": "Bushi",
    "Sibelyx": "Reptyro",
    "Elphidran": "Pyrin",
    "Elphidran Aqua": "Pyrin",
    "Kelpsea": "Rayhound",
    "Kelpsea Ignis": "Rayhound",
    "Azurobe": "Quivern",
    "Cryolinx": "Astegon",
    "Blazehowl": "Sibelyx",
    "Blazehowl Noct": "Mossanda",
    "Relaxaurus": "Orserk",
    "Relaxaurus Lux": "Beakon",
    "Broncherry": "Elphidran",
    "Broncherry Aqua": "Penking",
    "Petallia": "Cinnamoth",
    "Reptyro": "Menasting",
    "Ice Reptyro": "Beakon",
    "Kingpaca": "Elizabee",
    "Ice Kingpaca": "Reptyro",
    "Mammorest": "Menasting",
    "Mammorest Cryst": "Menasting",
    "Wumpo": "Elizabee",
    "Wumpo Botan": "Warsect",
    "Warsect": "Relaxaurus",
    "Fenglope": "Incineram",
    "Felbat": "Incineram",
    "Quivern": "Relaxaurus",
    "Blazamut": "Cryolinx",
    "Helzephyr": "Helzephyr",
    "Astegon": "Helzephyr",
    "Menasting": "Beakon",
    "Anubis": "Ragnahawk",
    "Jormuntide": "Menasting",
    "Jormuntide Ignis": "Menasting",
    "Suzaku": "Cryolinx",
    "Suzaku Aqua": "Cryolinx",
    "Grizzbolt": "Grizzbolt",
    "Lyleen": "Beakon",
    "Lyleen Noct": "Beakon",
    "Faleris": "Relaxaurus",
    "Orserk": "Astegon",
    "Shadowbeak": "Cryolinx",
    "Paladius": "Cryolinx",
    "Necromus": "Cryolinx",
    "Frostallion": "Astegon",
    "Frostallion Noct": "Astegon",
    "Jetragon": "Astegon"
  },
  "Lyleen": {
    "Lamball": "Broncherry",
    "Cattiva": "Digtoise",
    "Chikipi": "Reindrix",
    "Lifmunk": "Digtoise",
    "Foxparks": "Kitsun",
    "Fuack": "Arsox",
    "Sparkit": "Kitsun",
    "Tanzee": "Tombat",
    "Rooby": "Katress",
    "Pengullet": "Chillet",
    "Penking": "Ragnahawk",
    "Jolthog": "Dinossom",
    "Jolthog Cryst": "Chillet",
    "Gumoss": "Tombat",
    "Gumoss (Special)": "Tombat",
    "Vixy": "Digtoise",
    "Hoocrates": "Dinossom",
    "Teafant": "Celaray",
    "Depresso": "Dinossom",
    "Cremis": "Digtoise",
    "Daedream": "Rayhound",
    "Rushoar": "Univolt",
    "Nox": "Blazehowl",
    "Fuddler": "Rayhound",
    "Killamari": "Foxcicle",
    "Mau": "Broncherry",
    "Mau Cryst": "Digtoise",
    "Celaray": "Surfent",
    "Direhowl": "Vanwyrm",
    "Tocotoco": "Arsox",
    "Flopie": "Foxcicle",
    "Mozzarina": "Anubis",
    "Bristla": "Arsox",
    "Gobfin": "Univolt",
    "Gobfin Ignis": "Univolt",
    "Hangyu": "Kitsun",
    "Hangyu Cryst": "Kitsun",
    "Mossanda": "Warsect",
    "Mossanda Lux": "Reptyro",
    "Woolipop": "Blazehowl",
    "Caprity": "Incineram",
    "Melpaca": "Anubis",
    "Eikthyrdeer": "Incineram",
    "Eikthyrdeer Terra": "Anubis",
    "Nitewing": "Elizabee",
    "Ribunny": "Petallia",
    "Incineram": "Nitewing",
    "Incineram Noct": "Nitewing",
    "Cinnamoth": "Pyrin",
    "Arsox": "Penking",
    "Dumud": "Anubis",
    "Cawgnito": "Vanwyrm",
    "Leezpunk": "Univolt",
    "Leezpunk Ignis": "Katress",
    "Loupmoon": "Incineram",
    "Galeclaw": "Bushi",
    "Robinquill": "Bushi",
    "Robinquill Terra": "Bushi",
    "Gorirat": "Bushi",
    "Beegarde": "Vanwyrm",
    "Elizabee": "Relaxaurus",
    "Grintale": "Ragnahawk",
    "Swee": "Petallia",
    "Sweepa": "Elizabee",
    "Chillet": "Penking",
    "Univolt": "Wumpo",
    "Foxcicle": "Azurobe",
    "Pyrin": "Jormuntide",
    "Pyrin Noct": "Menasting",
    "Reindrix": "Anubis",
    "Rayhound": "Azurobe",
    "Kitsun": "Elphidran",
    "Dazzi": "Rayhound",
    "Lunaris": "Univolt",
    "Dinossom": "Elphidran",
    "Dinossom Lux": "Elphidran",
    "Surfent": "Sweepa",
    "Surfent Terra": "Sweepa",
    "Maraith": "Katress",
    "Digtoise": "Elphidran",
    "Tombat": "Azurobe",
    "Lovander": "Incineram",
    "Flambelle": "Kitsun",
    "Vanwyrm": "Sibelyx",
    "Vanwyrm Cryst": "Mossanda",
    "Bushi": "Sibelyx",
    "Beakon": "Beakon",
    "Ragnahawk": "Jormuntide",
    "Katress": "Wumpo Botan",
    "Wixen": "Blazehowl",
    "Verdash": "Bushi",
    "Vaelet": "Vanwyrm",
    "Sibelyx": "Quivern",
    "Elphidran": "Sweepa",
    "Elphidran Aqua": "Ragnahawk",
    "Kelpsea": "Tombat",
    "Kelpsea Ignis": "Foxcicle",
    "Azurobe": "Ragnahawk",
    "Cryolinx": "Helzephyr",
    "Blazehowl": "Wumpo Botan",
    "Blazehowl Noct": "Wumpo",
    "Relaxaurus": "Menasting",
    "Relaxaurus Lux": "Menasting",
    "Broncherry": "Surfent",
    "Broncherry Aqua": "Elphidran",
    "Petallia": "Penking",
    "Reptyro": "Relaxaurus",
    "Ice Reptyro": "Beakon",
    "Kingpaca": "Pyrin",
    "Ice Kingpaca": "Warsect",
    "Mammorest": "Relaxaurus",
    "Mammorest Cryst": "Relaxaurus",
    "Wumpo": "Pyrin",
    "Wumpo Botan": "Pyrin",
    "Warsect": "Mammorest",
    "Fenglope": "Incineram",
    "Felbat": "Bushi",
    "Quivern": "Mammorest",
    "Blazamut": "Cryolinx",
    "Helzephyr": "Beakon",
    "Astegon": "Helzephyr",
    "Menasting": "Lyleen Noct",
    "Anubis": "Sweepa",
    "Jormuntide": "Relaxaurus",
    "Jormuntide Ignis": "Relaxaurus",
    "Suzaku": "Astegon",
    "Suzaku Aqua": "Cryolinx",
    "Grizzbolt": "Beakon",
    "Lyleen": "Lyleen",
    "Lyleen Noct": "Beakon",
    "Faleris": "Jormuntide",
    "Orserk": "Helzephyr",
    "Shadowbeak": "Astegon",
    "Paladius": "Astegon",
    "Necromus": "Astegon",
    "Frostallion": "Helzephyr",
    "Frostallion Noct": "Helzephyr",
    "Jetragon": "Astegon"
  },
  "Lyleen Noct": {
    "variant": true,
    "Lamball": "Digtoise",
    "Cattiva": "Kitsun",
    "Chikipi": "Digtoise",
    "Lifmunk": "Dinossom",
    "Foxparks": "Chillet",
    "Fuack": "Foxcicle",
    "Sparkit": "Dinossom",
    "Tanzee": "Rayhound",
    "Rooby": "Univolt",
    "Pengullet": "Petallia",
    "Penking": "Pyrin",
    "Jolthog": "Arsox",
    "Jolthog Cryst": "Arsox",
    "Gumoss": "Rayhound",
    "Gumoss (Special)": "Rayhound",
    "Vixy": "Kitsun",
    "Hoocrates": "Chillet",
    "Teafant": "Digtoise",
    "Depresso": "Arsox",
    "Cremis": "Kitsun",
    "Daedream": "Blazehowl",
    "Rushoar": "Univolt",
    "Nox": "Katress",
    "Fuddler": "Blazehowl",
    "Killamari": "Tombat",
    "Mau": "Digtoise",
    "Mau Cryst": "Kitsun",
    "Celaray": "Elphidran",
    "Direhowl": "Bushi",
    "Tocotoco": "Petallia",
    "Flopie": "Tombat",
    "Mozzarina": "Surfent",
    "Bristla": "Foxcicle",
    "Gobfin": "Vanwyrm",
    "Gobfin Ignis": "Vanwyrm",
    "Hangyu": "Dinossom",
    "Hangyu Cryst": "Dinossom",
    "Mossanda": "Reptyro",
    "Mossanda Lux": "Mammorest",
    "Woolipop": "Katress",
    "Caprity": "Anubis",
    "Melpaca": "Elphidran",
    "Eikthyrdeer": "Anubis",
    "Eikthyrdeer Terra": "Surfent",
    "Nitewing": "Jormuntide",
    "Ribunny": "Foxcicle",
    "Incineram": "Sweepa",
    "Incineram Noct": "Sweepa",
    "Cinnamoth": "Quivern",
    "Arsox": "Azurobe",
    "Dumud": "Surfent",
    "Cawgnito": "Bushi",
    "Leezpunk": "Vanwyrm",
    "Leezpunk Ignis": "Univolt",
    "Loupmoon": "Anubis",
    "Galeclaw": "Bushi",
    "Robinquill": "Incineram",
    "Robinquill Terra": "Incineram",
    "Gorirat": "Bushi",
    "Beegarde": "Bushi",
    "Elizabee": "Relaxaurus",
    "Grintale": "Pyrin",
    "Swee": "Tombat",
    "Sweepa": "Jormuntide",
    "Chillet": "Azurobe",
    "Univolt": "Sibelyx",
    "Foxcicle": "Wumpo Botan",
    "Pyrin": "Relaxaurus",
    "Pyrin Noct": "Beakon",
    "Reindrix": "Elphidran",
    "Rayhound": "Wumpo Botan",
    "Kitsun": "Penking",
    "Dazzi": "Blazehowl",
    "Lunaris": "Vanwyrm",
    "Dinossom": "Penking",
    "Dinossom Lux": "Grintale",
    "Surfent": "Ragnahawk",
    "Surfent Terra": "Ragnahawk",
    "Maraith": "Univolt",
    "Digtoise": "Elphidran",
    "Tombat": "Wumpo Botan",
    "Lovander": "Anubis",
    "Flambelle": "Chillet",
    "Vanwyrm": "Mossanda",
    "Vanwyrm Cryst": "Nitewing",
    "Bushi": "Nitewing",
    "Beakon": "Beakon",
    "Ragnahawk": "Mammorest",
    "Katress": "Sibelyx",
    "Wixen": "Univolt",
    "Verdash": "Incineram",
    "Vaelet": "Bushi",
    "Sibelyx": "Elizabee",
    "Elphidran": "Ragnahawk",
    "Elphidran Aqua": "Pyrin",
    "Kelpsea": "Rayhound",
    "Kelpsea Ignis": "Rayhound",
    "Azurobe": "Pyrin",
    "Cryolinx": "Astegon",
    "Blazehowl": "Wumpo",
    "Blazehowl Noct": "Sibelyx",
    "Relaxaurus": "Menasting",
    "Relaxaurus Lux": "Beakon",
    "Broncherry": "Elphidran",
    "Broncherry Aqua": "Penking",
    "Petallia": "Azurobe",
    "Reptyro": "Menasting",
    "Ice Reptyro": "Beakon",
    "Kingpaca": "Warsect",
    "Ice Kingpaca": "Reptyro",
    "Mammorest": "Menasting",
    "Mammorest Cryst": "Menasting",
    "Wumpo": "Elizabee",
    "Wumpo Botan": "Warsect",
    "Warsect": "Relaxaurus",
    "Fenglope": "Incineram",
    "Felbat": "Incineram",
    "Quivern": "Relaxaurus",
    "Blazamut": "Cryolinx",
    "Helzephyr": "Helzephyr",
    "Astegon": "Helzephyr",
    "Menasting": "Beakon",
    "Anubis": "Ragnahawk",
    "Jormuntide": "Menasting",
    "Jormuntide Ignis": "Menasting",
    "Suzaku": "Cryolinx",
    "Suzaku Aqua": "Cryolinx",
    "Grizzbolt": "Beakon",
    "Lyleen": "Beakon",
    "Lyleen Noct": "Lyleen Noct",
    "Faleris": "Relaxaurus",
    "Orserk": "Helzephyr",
    "Shadowbeak": "Cryolinx",
    "Paladius": "Astegon",
    "Necromus": "Cryolinx",
    "Frostallion": "Astegon",
    "Frostallion Noct": "Astegon",
    "Jetragon": "Astegon"
  },
  "Faleris": {
    "Lamball": "Eikthyrdeer",
    "Cattiva": "Eikthyrdeer",
    "Chikipi": "Caprity",
    "Lifmunk": "Dumud",
    "Foxparks": "Melpaca",
    "Fuack": "Digtoise",
    "Sparkit": "Melpaca",
    "Tanzee": "Dinossom",
    "Rooby": "Foxcicle",
    "Pengullet": "Broncherry",
    "Penking": "Sibelyx",
    "Jolthog": "Celaray",
    "Jolthog Cryst": "Broncherry",
    "Gumoss": "Chillet",
    "Gumoss (Special)": "Chillet",
    "Vixy": "Mozzarina",
    "Hoocrates": "Reindrix",
    "Teafant": "Caprity",
    "Depresso": "Reindrix",
    "Cremis": "Mozzarina",
    "Daedream": "Chillet",
    "Rushoar": "Tombat",
    "Nox": "Petallia",
    "Fuddler": "Arsox",
    "Killamari": "Kitsun",
    "Mau": "Eikthyrdeer",
    "Mau Cryst": "Mozzarina",
    "Celaray": "Bushi",
    "Direhowl": "Blazehowl",
    "Tocotoco": "Digtoise",
    "Flopie": "Kitsun",
    "Mozzarina": "Bushi",
    "Bristla": "Digtoise",
    "Gobfin": "Rayhound",
    "Gobfin Ignis": "Rayhound",
    "Hangyu": "Dumud",
    "Hangyu Cryst": "Dumud",
    "Mossanda": "Sweepa",
    "Mossanda Lux": "Ragnahawk",
    "Woolipop": "Petallia",
    "Caprity": "Vanwyrm",
    "Melpaca": "Bushi",
    "Eikthyrdeer": "Bushi",
    "Eikthyrdeer Terra": "Bushi",
    "Nitewing": "Sweepa",
    "Ribunny": "Digtoise",
    "Incineram": "Wumpo Botan",
    "Incineram Noct": "Wumpo Botan",
    "Cinnamoth": "Mossanda",
    "Arsox": "Anubis",
    "Dumud": "Bushi",
    "Cawgnito": "Rayhound",
    "Leezpunk": "Tombat",
    "Leezpunk Ignis": "Tombat",
    "Loupmoon": "Vanwyrm",
    "Galeclaw": "Katress",
    "Robinquill": "Katress",
    "Robinquill Terra": "Univolt",
    "Gorirat": "Blazehowl",
    "Beegarde": "Blazehowl",
    "Elizabee": "Quivern",
    "Grintale": "Sibelyx",
    "Swee": "Kitsun",
    "Sweepa": "Ragnahawk",
    "Chillet": "Incineram",
    "Univolt": "Penking",
    "Foxcicle": "Anubis",
    "Pyrin": "Pyrin",
    "Pyrin Noct": "Jormuntide",
    "Reindrix": "Bushi",
    "Rayhound": "Surfent",
    "Kitsun": "Incineram",
    "Dazzi": "Arsox",
    "Lunaris": "Rayhound",
    "Dinossom": "Incineram",
    "Dinossom Lux": "Incineram",
    "Surfent": "Wumpo",
    "Surfent Terra": "Wumpo",
    "Maraith": "Foxcicle",
    "Digtoise": "Incineram",
    "Tombat": "Surfent",
    "Lovander": "Vanwyrm",
    "Flambelle": "Melpaca",
    "Vanwyrm": "Penking",
    "Vanwyrm Cryst": "Azurobe",
    "Bushi": "Azurobe",
    "Beakon": "Mammorest",
    "Ragnahawk": "Ragnahawk",
    "Katress": "Elphidran",
    "Wixen": "Foxcicle",
    "Verdash": "Univolt",
    "Vaelet": "Blazehowl",
    "Sibelyx": "Sweepa",
    "Elphidran": "Sibelyx",
    "Elphidran Aqua": "Sibelyx",
    "Kelpsea": "Dinossom",
    "Kelpsea Ignis": "Dinossom",
    "Azurobe": "Mossanda",
    "Cryolinx": "Menasting",
    "Blazehowl": "Elphidran",
    "Blazehowl Noct": "Penking",
    "Relaxaurus": "Reptyro",
    "Relaxaurus Lux": "Reptyro",
    "Broncherry": "Incineram",
    "Broncherry Aqua": "Incineram",
    "Petallia": "Anubis",
    "Reptyro": "Warsect",
    "Ice Reptyro": "Mammorest",
    "Kingpaca": "Nitewing",
    "Ice Kingpaca": "Sweepa",
    "Mammorest": "Elizabee",
    "Mammorest Cryst": "Elizabee",
    "Wumpo": "Nitewing",
    "Wumpo Botan": "Nitewing",
    "Warsect": "Pyrin",
    "Fenglope": "Univolt",
    "Felbat": "Univolt",
    "Quivern": "Pyrin",
    "Blazamut": "Helzephyr",
    "Helzephyr": "Relaxaurus",
    "Astegon": "Menasting",
    "Menasting": "Jormuntide",
    "Anubis": "Kingpaca",
    "Jormuntide": "Warsect",
    "Jormuntide Ignis": "Warsect",
    "Suzaku": "Beakon",
    "Suzaku Aqua": "Helzephyr",
    "Grizzbolt": "Relaxaurus",
    "Lyleen": "Jormuntide",
    "Lyleen Noct": "Relaxaurus",
    "Faleris": "Faleris",
    "Orserk": "Menasting",
    "Shadowbeak": "Beakon",
    "Paladius": "Beakon",
    "Necromus": "Beakon",
    "Frostallion": "Menasting",
    "Frostallion Noct": "Beakon",
    "Jetragon": "Beakon"
  },
  "Orserk": {
    "Lamball": "Chillet",
    "Cattiva": "Chillet",
    "Chikipi": "Dinossom",
    "Lifmunk": "Arsox",
    "Foxparks": "Foxcicle",
    "Fuack": "Rayhound",
    "Sparkit": "Petallia",
    "Tanzee": "Katress",
    "Rooby": "Bushi",
    "Pengullet": "Tombat",
    "Penking": "Elizabee",
    "Jolthog": "Tombat",
    "Jolthog Cryst": "Tombat",
    "Gumoss": "Univolt",
    "Gumoss (Special)": "Univolt",
    "Vixy": "Arsox",
    "Hoocrates": "Foxcicle",
    "Teafant": "Dinossom",
    "Depresso": "Foxcicle",
    "Cremis": "Chillet",
    "Daedream": "Univolt",
    "Rushoar": "Bushi",
    "Nox": "Vanwyrm",
    "Fuddler": "Univolt",
    "Killamari": "Blazehowl",
    "Mau": "Dinossom",
    "Mau Cryst": "Arsox",
    "Celaray": "Azurobe",
    "Direhowl": "Incineram",
    "Tocotoco": "Rayhound",
    "Flopie": "Blazehowl",
    "Mozzarina": "Penking",
    "Bristla": "Rayhound",
    "Gobfin": "Incineram",
    "Gobfin Ignis": "Bushi",
    "Hangyu": "Petallia",
    "Hangyu Cryst": "Petallia",
    "Mossanda": "Relaxaurus",
    "Mossanda Lux": "Menasting",
    "Woolipop": "Vanwyrm",
    "Caprity": "Elphidran",
    "Melpaca": "Penking",
    "Eikthyrdeer": "Elphidran",
    "Eikthyrdeer Terra": "Penking",
    "Nitewing": "Relaxaurus",
    "Ribunny": "Rayhound",
    "Incineram": "Pyrin",
    "Incineram Noct": "Pyrin",
    "Cinnamoth": "Jormuntide",
    "Arsox": "Wumpo",
    "Dumud": "Penking",
    "Cawgnito": "Incineram",
    "Leezpunk": "Bushi",
    "Leezpunk Ignis": "Bushi",
    "Loupmoon": "Elphidran",
    "Galeclaw": "Incineram",
    "Robinquill": "Anubis",
    "Robinquill Terra": "Anubis",
    "Gorirat": "Incineram",
    "Beegarde": "Incineram",
    "Elizabee": "Beakon",
    "Grintale": "Reptyro",
    "Swee": "Blazehowl",
    "Sweepa": "Relaxaurus",
    "Chillet": "Kingpaca",
    "Univolt": "Sweepa",
    "Foxcicle": "Sibelyx",
    "Pyrin": "Menasting",
    "Pyrin Noct": "Helzephyr",
    "Reindrix": "Grintale",
    "Rayhound": "Sibelyx",
    "Kitsun": "Wumpo Botan",
    "Dazzi": "Univolt",
    "Lunaris": "Bushi",
    "Dinossom": "Wumpo Botan",
    "Dinossom Lux": "Wumpo Botan",
    "Surfent": "Quivern",
    "Surfent Terra": "Warsect",
    "Maraith": "Bushi",
    "Digtoise": "Azurobe",
    "Tombat": "Sibelyx",
    "Lovander": "Elphidran",
    "Flambelle": "Petallia",
    "Vanwyrm": "Sweepa",
    "Vanwyrm Cryst": "Ragnahawk",
    "Bushi": "Ragnahawk",
    "Beakon": "Helzephyr",
    "Ragnahawk": "Menasting",
    "Katress": "Nitewing",
    "Wixen": "Vanwyrm",
    "Verdash": "Anubis",
    "Vaelet": "Incineram",
    "Sibelyx": "Mammorest",
    "Elphidran": "Warsect",
    "Elphidran Aqua": "Elizabee",
    "Kelpsea": "Katress",
    "Kelpsea Ignis": "Blazehowl",
    "Azurobe": "Reptyro",
    "Cryolinx": "Cryolinx",
    "Blazehowl": "Nitewing",
    "Blazehowl Noct": "Sweepa",
    "Relaxaurus": "Beakon",
    "Relaxaurus Lux": "Beakon",
    "Broncherry": "Azurobe",
    "Broncherry Aqua": "Cinnamoth",
    "Petallia": "Wumpo",
    "Reptyro": "Beakon",
    "Ice Reptyro": "Helzephyr",
    "Kingpaca": "Jormuntide",
    "Ice Kingpaca": "Relaxaurus",
    "Mammorest": "Beakon",
    "Mammorest Cryst": "Beakon",
    "Wumpo": "Mammorest",
    "Wumpo Botan": "Jormuntide",
    "Warsect": "Beakon",
    "Fenglope": "Surfent",
    "Felbat": "Anubis",
    "Quivern": "Menasting",
    "Blazamut": "Suzaku",
    "Helzephyr": "Astegon",
    "Astegon": "Astegon",
    "Menasting": "Helzephyr",
    "Anubis": "Pyrin",
    "Jormuntide": "Beakon",
    "Jormuntide Ignis": "Beakon",
    "Suzaku": "Cryolinx",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Astegon",
    "Lyleen": "Helzephyr",
    "Lyleen Noct": "Helzephyr",
    "Faleris": "Menasting",
    "Orserk": "Orserk",
    "Shadowbeak": "Cryolinx",
    "Paladius": "Cryolinx",
    "Necromus": "Cryolinx",
    "Frostallion": "Cryolinx",
    "Frostallion Noct": "Cryolinx",
    "Jetragon": "Cryolinx"
  },
  "Shadowbeak": {
    "Lamball": "Foxcicle",
    "Cattiva": "Foxcicle",
    "Chikipi": "Petallia",
    "Lifmunk": "Tombat",
    "Foxparks": "Rayhound",
    "Fuack": "Katress",
    "Sparkit": "Rayhound",
    "Tanzee": "Vanwyrm",
    "Rooby": "Incineram",
    "Pengullet": "Blazehowl",
    "Penking": "Relaxaurus",
    "Jolthog": "Blazehowl",
    "Jolthog Cryst": "Blazehowl",
    "Gumoss": "Vanwyrm",
    "Gumoss (Special)": "Vanwyrm",
    "Vixy": "Tombat",
    "Hoocrates": "Rayhound",
    "Teafant": "Petallia",
    "Depresso": "Blazehowl",
    "Cremis": "Foxcicle",
    "Daedream": "Bushi",
    "Rushoar": "Incineram",
    "Nox": "Bushi",
    "Fuddler": "Bushi",
    "Killamari": "Univolt",
    "Mau": "Foxcicle",
    "Mau Cryst": "Tombat",
    "Celaray": "Wumpo",
    "Direhowl": "Surfent",
    "Tocotoco": "Katress",
    "Flopie": "Univolt",
    "Mozzarina": "Wumpo Botan",
    "Bristla": "Univolt",
    "Gobfin": "Anubis",
    "Gobfin Ignis": "Anubis",
    "Hangyu": "Rayhound",
    "Hangyu Cryst": "Rayhound",
    "Mossanda": "Menasting",
    "Mossanda Lux": "Beakon",
    "Woolipop": "Bushi",
    "Caprity": "Azurobe",
    "Melpaca": "Wumpo Botan",
    "Eikthyrdeer": "Cinnamoth",
    "Eikthyrdeer Terra": "Wumpo Botan",
    "Nitewing": "Beakon",
    "Ribunny": "Univolt",
    "Incineram": "Reptyro",
    "Incineram Noct": "Reptyro",
    "Cinnamoth": "Relaxaurus",
    "Arsox": "Nitewing",
    "Dumud": "Wumpo Botan",
    "Cawgnito": "Anubis",
    "Leezpunk": "Incineram",
    "Leezpunk Ignis": "Incineram",
    "Loupmoon": "Azurobe",
    "Galeclaw": "Elphidran",
    "Robinquill": "Elphidran",
    "Robinquill Terra": "Elphidran",
    "Gorirat": "Elphidran",
    "Beegarde": "Anubis",
    "Elizabee": "Helzephyr",
    "Grintale": "Relaxaurus",
    "Swee": "Univolt",
    "Sweepa": "Beakon",
    "Chillet": "Mossanda",
    "Univolt": "Pyrin",
    "Foxcicle": "Sweepa",
    "Pyrin": "Beakon",
    "Pyrin Noct": "Astegon",
    "Reindrix": "Kingpaca",
    "Rayhound": "Sweepa",
    "Kitsun": "Sibelyx",
    "Dazzi": "Bushi",
    "Lunaris": "Incineram",
    "Dinossom": "Sibelyx",
    "Dinossom Lux": "Mossanda",
    "Surfent": "Jormuntide",
    "Surfent Terra": "Jormuntide",
    "Maraith": "Incineram",
    "Digtoise": "Sibelyx",
    "Tombat": "Sweepa",
    "Lovander": "Azurobe",
    "Flambelle": "Rayhound",
    "Vanwyrm": "Pyrin",
    "Vanwyrm Cryst": "Warsect",
    "Bushi": "Quivern",
    "Beakon": "Cryolinx",
    "Ragnahawk": "Beakon",
    "Katress": "Ragnahawk",
    "Wixen": "Incineram",
    "Verdash": "Penking",
    "Vaelet": "Surfent",
    "Sibelyx": "Menasting",
    "Elphidran": "Mammorest",
    "Elphidran Aqua": "Mammorest",
    "Kelpsea": "Vanwyrm",
    "Kelpsea Ignis": "Vanwyrm",
    "Azurobe": "Relaxaurus",
    "Cryolinx": "Cryolinx",
    "Blazehowl": "Ragnahawk",
    "Blazehowl Noct": "Pyrin",
    "Relaxaurus": "Astegon",
    "Relaxaurus Lux": "Astegon",
    "Broncherry": "Wumpo",
    "Broncherry Aqua": "Sibelyx",
    "Petallia": "Nitewing",
    "Reptyro": "Helzephyr",
    "Ice Reptyro": "Astegon",
    "Kingpaca": "Menasting",
    "Ice Kingpaca": "Menasting",
    "Mammorest": "Helzephyr",
    "Mammorest Cryst": "Helzephyr",
    "Wumpo": "Menasting",
    "Wumpo Botan": "Relaxaurus",
    "Warsect": "Helzephyr",
    "Fenglope": "Penking",
    "Felbat": "Elphidran",
    "Quivern": "Beakon",
    "Blazamut": "Suzaku",
    "Helzephyr": "Cryolinx",
    "Astegon": "Cryolinx",
    "Menasting": "Astegon",
    "Anubis": "Jormuntide",
    "Jormuntide": "Helzephyr",
    "Jormuntide Ignis": "Helzephyr",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Cryolinx",
    "Lyleen": "Astegon",
    "Lyleen Noct": "Cryolinx",
    "Faleris": "Beakon",
    "Orserk": "Cryolinx",
    "Shadowbeak": "Shadowbeak",
    "Paladius": "Suzaku",
    "Necromus": "Suzaku",
    "Frostallion": "Suzaku",
    "Frostallion Noct": "Suzaku",
    "Jetragon": "Suzaku"
  },
  "Paladius": {
    "Lamball": "Petallia",
    "Cattiva": "Foxcicle",
    "Chikipi": "Arsox",
    "Lifmunk": "Tombat",
    "Foxparks": "Rayhound",
    "Fuack": "Blazehowl",
    "Sparkit": "Tombat",
    "Tanzee": "Vanwyrm",
    "Rooby": "Bushi",
    "Pengullet": "Blazehowl",
    "Penking": "Mammorest",
    "Jolthog": "Rayhound",
    "Jolthog Cryst": "Blazehowl",
    "Gumoss": "Vanwyrm",
    "Gumoss (Special)": "Vanwyrm",
    "Vixy": "Foxcicle",
    "Hoocrates": "Rayhound",
    "Teafant": "Arsox",
    "Depresso": "Rayhound",
    "Cremis": "Foxcicle",
    "Daedream": "Vanwyrm",
    "Rushoar": "Incineram",
    "Nox": "Bushi",
    "Fuddler": "Vanwyrm",
    "Killamari": "Univolt",
    "Mau": "Petallia",
    "Mau Cryst": "Foxcicle",
    "Celaray": "Wumpo Botan",
    "Direhowl": "Anubis",
    "Tocotoco": "Blazehowl",
    "Flopie": "Univolt",
    "Mozzarina": "Azurobe",
    "Bristla": "Katress",
    "Gobfin": "Incineram",
    "Gobfin Ignis": "Incineram",
    "Hangyu": "Tombat",
    "Hangyu Cryst": "Tombat",
    "Mossanda": "Menasting",
    "Mossanda Lux": "Beakon",
    "Woolipop": "Bushi",
    "Caprity": "Azurobe",
    "Melpaca": "Wumpo Botan",
    "Eikthyrdeer": "Azurobe",
    "Eikthyrdeer Terra": "Cinnamoth",
    "Nitewing": "Menasting",
    "Ribunny": "Katress",
    "Incineram": "Elizabee",
    "Incineram Noct": "Elizabee",
    "Cinnamoth": "Relaxaurus",
    "Arsox": "Mossanda",
    "Dumud": "Cinnamoth",
    "Cawgnito": "Anubis",
    "Leezpunk": "Incineram",
    "Leezpunk Ignis": "Incineram",
    "Loupmoon": "Penking",
    "Galeclaw": "Surfent",
    "Robinquill": "Elphidran",
    "Robinquill Terra": "Elphidran",
    "Gorirat": "Surfent",
    "Beegarde": "Anubis",
    "Elizabee": "Beakon",
    "Grintale": "Mammorest",
    "Swee": "Univolt",
    "Sweepa": "Menasting",
    "Chillet": "Sibelyx",
    "Univolt": "Ragnahawk",
    "Foxcicle": "Nitewing",
    "Pyrin": "Beakon",
    "Pyrin Noct": "Astegon",
    "Reindrix": "Wumpo Botan",
    "Rayhound": "Sweepa",
    "Kitsun": "Sibelyx",
    "Dazzi": "Bushi",
    "Lunaris": "Incineram",
    "Dinossom": "Sibelyx",
    "Dinossom Lux": "Sibelyx",
    "Surfent": "Reptyro",
    "Surfent Terra": "Jormuntide",
    "Maraith": "Incineram",
    "Digtoise": "Wumpo",
    "Tombat": "Nitewing",
    "Lovander": "Grintale",
    "Flambelle": "Rayhound",
    "Vanwyrm": "Pyrin",
    "Vanwyrm Cryst": "Quivern",
    "Bushi": "Pyrin",
    "Beakon": "Astegon",
    "Ragnahawk": "Beakon",
    "Katress": "Ragnahawk",
    "Wixen": "Bushi",
    "Verdash": "Elphidran",
    "Vaelet": "Anubis",
    "Sibelyx": "Menasting",
    "Elphidran": "Jormuntide",
    "Elphidran Aqua": "Jormuntide",
    "Kelpsea": "Univolt",
    "Kelpsea Ignis": "Univolt",
    "Azurobe": "Relaxaurus",
    "Cryolinx": "Cryolinx",
    "Blazehowl": "Sweepa",
    "Blazehowl Noct": "Ragnahawk",
    "Relaxaurus": "Helzephyr",
    "Relaxaurus Lux": "Helzephyr",
    "Broncherry": "Kingpaca",
    "Broncherry Aqua": "Wumpo",
    "Petallia": "Mossanda",
    "Reptyro": "Helzephyr",
    "Ice Reptyro": "Astegon",
    "Kingpaca": "Relaxaurus",
    "Ice Kingpaca": "Menasting",
    "Mammorest": "Helzephyr",
    "Mammorest Cryst": "Helzephyr",
    "Wumpo": "Relaxaurus",
    "Wumpo Botan": "Relaxaurus",
    "Warsect": "Beakon",
    "Fenglope": "Elphidran",
    "Felbat": "Elphidran",
    "Quivern": "Beakon",
    "Blazamut": "Suzaku",
    "Helzephyr": "Cryolinx",
    "Astegon": "Cryolinx",
    "Menasting": "Astegon",
    "Anubis": "Reptyro",
    "Jormuntide": "Helzephyr",
    "Jormuntide Ignis": "Helzephyr",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Cryolinx",
    "Lyleen": "Astegon",
    "Lyleen Noct": "Astegon",
    "Faleris": "Beakon",
    "Orserk": "Cryolinx",
    "Shadowbeak": "Suzaku",
    "Paladius": "Paladius",
    "Necromus": "Suzaku",
    "Frostallion": "Cryolinx",
    "Frostallion Noct": "Suzaku",
    "Jetragon": "Suzaku"
  },
  "Necromus": {
    "Lamball": "Foxcicle",
    "Cattiva": "Foxcicle",
    "Chikipi": "Arsox",
    "Lifmunk": "Tombat",
    "Foxparks": "Rayhound",
    "Fuack": "Katress",
    "Sparkit": "Rayhound",
    "Tanzee": "Vanwyrm",
    "Rooby": "Incineram",
    "Pengullet": "Blazehowl",
    "Penking": "Mammorest",
    "Jolthog": "Blazehowl",
    "Jolthog Cryst": "Blazehowl",
    "Gumoss": "Vanwyrm",
    "Gumoss (Special)": "Vanwyrm",
    "Vixy": "Foxcicle",
    "Hoocrates": "Rayhound",
    "Teafant": "Petallia",
    "Depresso": "Rayhound",
    "Cremis": "Foxcicle",
    "Daedream": "Vanwyrm",
    "Rushoar": "Incineram",
    "Nox": "Bushi",
    "Fuddler": "Bushi",
    "Killamari": "Univolt",
    "Mau": "Petallia",
    "Mau Cryst": "Tombat",
    "Celaray": "Kingpaca",
    "Direhowl": "Anubis",
    "Tocotoco": "Blazehowl",
    "Flopie": "Univolt",
    "Mozzarina": "Cinnamoth",
    "Bristla": "Katress",
    "Gobfin": "Anubis",
    "Gobfin Ignis": "Incineram",
    "Hangyu": "Tombat",
    "Hangyu Cryst": "Tombat",
    "Mossanda": "Menasting",
    "Mossanda Lux": "Beakon",
    "Woolipop": "Bushi",
    "Caprity": "Azurobe",
    "Melpaca": "Wumpo Botan",
    "Eikthyrdeer": "Azurobe",
    "Eikthyrdeer Terra": "Wumpo Botan",
    "Nitewing": "Menasting",
    "Ribunny": "Univolt",
    "Incineram": "Elizabee",
    "Incineram Noct": "Reptyro",
    "Cinnamoth": "Relaxaurus",
    "Arsox": "Mossanda",
    "Dumud": "Wumpo Botan",
    "Cawgnito": "Anubis",
    "Leezpunk": "Incineram",
    "Leezpunk Ignis": "Incineram",
    "Loupmoon": "Grintale",
    "Galeclaw": "Elphidran",
    "Robinquill": "Elphidran",
    "Robinquill Terra": "Elphidran",
    "Gorirat": "Surfent",
    "Beegarde": "Anubis",
    "Elizabee": "Helzephyr",
    "Grintale": "Relaxaurus",
    "Swee": "Univolt",
    "Sweepa": "Beakon",
    "Chillet": "Mossanda",
    "Univolt": "Ragnahawk",
    "Foxcicle": "Nitewing",
    "Pyrin": "Beakon",
    "Pyrin Noct": "Astegon",
    "Reindrix": "Wumpo Botan",
    "Rayhound": "Sweepa",
    "Kitsun": "Sibelyx",
    "Dazzi": "Bushi",
    "Lunaris": "Incineram",
    "Dinossom": "Sibelyx",
    "Dinossom Lux": "Sibelyx",
    "Surfent": "Jormuntide",
    "Surfent Terra": "Jormuntide",
    "Maraith": "Incineram",
    "Digtoise": "Wumpo",
    "Tombat": "Sweepa",
    "Lovander": "Azurobe",
    "Flambelle": "Rayhound",
    "Vanwyrm": "Pyrin",
    "Vanwyrm Cryst": "Warsect",
    "Bushi": "Pyrin",
    "Beakon": "Astegon",
    "Ragnahawk": "Beakon",
    "Katress": "Ragnahawk",
    "Wixen": "Incineram",
    "Verdash": "Elphidran",
    "Vaelet": "Surfent",
    "Sibelyx": "Menasting",
    "Elphidran": "Jormuntide",
    "Elphidran Aqua": "Mammorest",
    "Kelpsea": "Vanwyrm",
    "Kelpsea Ignis": "Univolt",
    "Azurobe": "Relaxaurus",
    "Cryolinx": "Cryolinx",
    "Blazehowl": "Ragnahawk",
    "Blazehowl Noct": "Pyrin",
    "Relaxaurus": "Helzephyr",
    "Relaxaurus Lux": "Astegon",
    "Broncherry": "Wumpo",
    "Broncherry Aqua": "Sibelyx",
    "Petallia": "Nitewing",
    "Reptyro": "Helzephyr",
    "Ice Reptyro": "Astegon",
    "Kingpaca": "Relaxaurus",
    "Ice Kingpaca": "Menasting",
    "Mammorest": "Helzephyr",
    "Mammorest Cryst": "Helzephyr",
    "Wumpo": "Menasting",
    "Wumpo Botan": "Relaxaurus",
    "Warsect": "Beakon",
    "Fenglope": "Penking",
    "Felbat": "Elphidran",
    "Quivern": "Beakon",
    "Blazamut": "Suzaku",
    "Helzephyr": "Cryolinx",
    "Astegon": "Cryolinx",
    "Menasting": "Astegon",
    "Anubis": "Reptyro",
    "Jormuntide": "Helzephyr",
    "Jormuntide Ignis": "Helzephyr",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Cryolinx",
    "Lyleen": "Astegon",
    "Lyleen Noct": "Cryolinx",
    "Faleris": "Beakon",
    "Orserk": "Cryolinx",
    "Shadowbeak": "Suzaku",
    "Paladius": "Suzaku",
    "Necromus": "Necromus",
    "Frostallion": "Cryolinx",
    "Frostallion Noct": "Suzaku",
    "Jetragon": "Suzaku"
  },
  "Frostallion": {
    "Lamball": "Arsox",
    "Cattiva": "Arsox",
    "Chikipi": "Dinossom",
    "Lifmunk": "Petallia",
    "Foxparks": "Foxcicle",
    "Fuack": "Rayhound",
    "Sparkit": "Foxcicle",
    "Tanzee": "Univolt",
    "Rooby": "Bushi",
    "Pengullet": "Rayhound",
    "Penking": "Reptyro",
    "Jolthog": "Tombat",
    "Jolthog Cryst": "Rayhound",
    "Gumoss": "Univolt",
    "Gumoss (Special)": "Univolt",
    "Vixy": "Arsox",
    "Hoocrates": "Tombat",
    "Teafant": "Chillet",
    "Depresso": "Tombat",
    "Cremis": "Arsox",
    "Daedream": "Univolt",
    "Rushoar": "Bushi",
    "Nox": "Vanwyrm",
    "Fuddler": "Univolt",
    "Killamari": "Blazehowl",
    "Mau": "Chillet",
    "Mau Cryst": "Petallia",
    "Celaray": "Azurobe",
    "Direhowl": "Incineram",
    "Tocotoco": "Rayhound",
    "Flopie": "Katress",
    "Mozzarina": "Penking",
    "Bristla": "Blazehowl",
    "Gobfin": "Incineram",
    "Gobfin Ignis": "Incineram",
    "Hangyu": "Foxcicle",
    "Hangyu Cryst": "Petallia",
    "Mossanda": "Relaxaurus",
    "Mossanda Lux": "Menasting",
    "Woolipop": "Vanwyrm",
    "Caprity": "Penking",
    "Melpaca": "Azurobe",
    "Eikthyrdeer": "Penking",
    "Eikthyrdeer Terra": "Grintale",
    "Nitewing": "Relaxaurus",
    "Ribunny": "Blazehowl",
    "Incineram": "Pyrin",
    "Incineram Noct": "Quivern",
    "Cinnamoth": "Jormuntide",
    "Arsox": "Sibelyx",
    "Dumud": "Grintale",
    "Cawgnito": "Incineram",
    "Leezpunk": "Bushi",
    "Leezpunk Ignis": "Bushi",
    "Loupmoon": "Elphidran",
    "Galeclaw": "Anubis",
    "Robinquill": "Anubis",
    "Robinquill Terra": "Surfent",
    "Gorirat": "Anubis",
    "Beegarde": "Incineram",
    "Elizabee": "Beakon",
    "Grintale": "Jormuntide",
    "Swee": "Blazehowl",
    "Sweepa": "Menasting",
    "Chillet": "Wumpo",
    "Univolt": "Sweepa",
    "Foxcicle": "Sibelyx",
    "Pyrin": "Beakon",
    "Pyrin Noct": "Helzephyr",
    "Reindrix": "Azurobe",
    "Rayhound": "Mossanda",
    "Kitsun": "Wumpo Botan",
    "Dazzi": "Vanwyrm",
    "Lunaris": "Incineram",
    "Dinossom": "Kingpaca",
    "Dinossom Lux": "Wumpo",
    "Surfent": "Warsect",
    "Surfent Terra": "Elizabee",
    "Maraith": "Bushi",
    "Digtoise": "Wumpo Botan",
    "Tombat": "Mossanda",
    "Lovander": "Elphidran",
    "Flambelle": "Foxcicle",
    "Vanwyrm": "Ragnahawk",
    "Vanwyrm Cryst": "Pyrin",
    "Bushi": "Ragnahawk",
    "Beakon": "Astegon",
    "Ragnahawk": "Menasting",
    "Katress": "Sweepa",
    "Wixen": "Bushi",
    "Verdash": "Surfent",
    "Vaelet": "Incineram",
    "Sibelyx": "Relaxaurus",
    "Elphidran": "Elizabee",
    "Elphidran Aqua": "Reptyro",
    "Kelpsea": "Univolt",
    "Kelpsea Ignis": "Katress",
    "Azurobe": "Jormuntide",
    "Cryolinx": "Cryolinx",
    "Blazehowl": "Nitewing",
    "Blazehowl Noct": "Sweepa",
    "Relaxaurus": "Helzephyr",
    "Relaxaurus Lux": "Helzephyr",
    "Broncherry": "Cinnamoth",
    "Broncherry Aqua": "Wumpo Botan",
    "Petallia": "Sibelyx",
    "Reptyro": "Beakon",
    "Ice Reptyro": "Helzephyr",
    "Kingpaca": "Mammorest",
    "Ice Kingpaca": "Relaxaurus",
    "Mammorest": "Beakon",
    "Mammorest Cryst": "Beakon",
    "Wumpo": "Relaxaurus",
    "Wumpo Botan": "Mammorest",
    "Warsect": "Beakon",
    "Fenglope": "Elphidran",
    "Felbat": "Anubis",
    "Quivern": "Beakon",
    "Blazamut": "Suzaku",
    "Helzephyr": "Frostallion Noct",
    "Astegon": "Cryolinx",
    "Menasting": "Helzephyr",
    "Anubis": "Warsect",
    "Jormuntide": "Beakon",
    "Jormuntide Ignis": "Beakon",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Astegon",
    "Lyleen": "Helzephyr",
    "Lyleen Noct": "Astegon",
    "Faleris": "Menasting",
    "Orserk": "Cryolinx",
    "Shadowbeak": "Suzaku",
    "Paladius": "Cryolinx",
    "Necromus": "Cryolinx",
    "Frostallion": "Frostallion",
    "Frostallion Noct": "Cryolinx",
    "Jetragon": "Cryolinx"
  },
  "Frostallion Noct": {
    "variant": true,
    "Lamball": "Arsox",
    "Cattiva": "Petallia",
    "Chikipi": "Chillet",
    "Lifmunk": "Foxcicle",
    "Foxparks": "Tombat",
    "Fuack": "Blazehowl",
    "Sparkit": "Tombat",
    "Tanzee": "Univolt",
    "Rooby": "Bushi",
    "Pengullet": "Rayhound",
    "Penking": "Jormuntide",
    "Jolthog": "Rayhound",
    "Jolthog Cryst": "Rayhound",
    "Gumoss": "Univolt",
    "Gumoss (Special)": "Univolt",
    "Vixy": "Petallia",
    "Hoocrates": "Tombat",
    "Teafant": "Arsox",
    "Depresso": "Rayhound",
    "Cremis": "Petallia",
    "Daedream": "Vanwyrm",
    "Rushoar": "Incineram",
    "Nox": "Bushi",
    "Fuddler": "Vanwyrm",
    "Killamari": "Katress",
    "Mau": "Arsox",
    "Mau Cryst": "Foxcicle",
    "Celaray": "Wumpo Botan",
    "Direhowl": "Anubis",
    "Tocotoco": "Blazehowl",
    "Flopie": "Univolt",
    "Mozzarina": "Azurobe",
    "Bristla": "Blazehowl",
    "Gobfin": "Incineram",
    "Gobfin Ignis": "Incineram",
    "Hangyu": "Foxcicle",
    "Hangyu Cryst": "Foxcicle",
    "Mossanda": "Menasting",
    "Mossanda Lux": "Menasting",
    "Woolipop": "Bushi",
    "Caprity": "Penking",
    "Melpaca": "Azurobe",
    "Eikthyrdeer": "Grintale",
    "Eikthyrdeer Terra": "Azurobe",
    "Nitewing": "Menasting",
    "Ribunny": "Blazehowl",
    "Incineram": "Warsect",
    "Incineram Noct": "Warsect",
    "Cinnamoth": "Mammorest",
    "Arsox": "Sibelyx",
    "Dumud": "Azurobe",
    "Cawgnito": "Incineram",
    "Leezpunk": "Incineram",
    "Leezpunk Ignis": "Bushi",
    "Loupmoon": "Penking",
    "Galeclaw": "Anubis",
    "Robinquill": "Surfent",
    "Robinquill Terra": "Elphidran",
    "Gorirat": "Anubis",
    "Beegarde": "Incineram",
    "Elizabee": "Beakon",
    "Grintale": "Jormuntide",
    "Swee": "Katress",
    "Sweepa": "Menasting",
    "Chillet": "Sibelyx",
    "Univolt": "Ragnahawk",
    "Foxcicle": "Mossanda",
    "Pyrin": "Beakon",
    "Pyrin Noct": "Astegon",
    "Reindrix": "Cinnamoth",
    "Rayhound": "Nitewing",
    "Kitsun": "Wumpo",
    "Dazzi": "Vanwyrm",
    "Lunaris": "Incineram",
    "Dinossom": "Wumpo",
    "Dinossom Lux": "Sibelyx",
    "Surfent": "Elizabee",
    "Surfent Terra": "Reptyro",
    "Maraith": "Bushi",
    "Digtoise": "Wumpo Botan",
    "Tombat": "Nitewing",
    "Lovander": "Penking",
    "Flambelle": "Tombat",
    "Vanwyrm": "Ragnahawk",
    "Vanwyrm Cryst": "Pyrin",
    "Bushi": "Pyrin",
    "Beakon": "Astegon",
    "Ragnahawk": "Beakon",
    "Katress": "Sweepa",
    "Wixen": "Bushi",
    "Verdash": "Elphidran",
    "Vaelet": "Anubis",
    "Sibelyx": "Relaxaurus",
    "Elphidran": "Reptyro",
    "Elphidran Aqua": "Jormuntide",
    "Kelpsea": "Univolt",
    "Kelpsea Ignis": "Univolt",
    "Azurobe": "Mammorest",
    "Cryolinx": "Cryolinx",
    "Blazehowl": "Sweepa",
    "Blazehowl Noct": "Ragnahawk",
    "Relaxaurus": "Helzephyr",
    "Relaxaurus Lux": "Helzephyr",
    "Broncherry": "Wumpo Botan",
    "Broncherry Aqua": "Kingpaca",
    "Petallia": "Sibelyx",
    "Reptyro": "Beakon",
    "Ice Reptyro": "Astegon",
    "Kingpaca": "Relaxaurus",
    "Ice Kingpaca": "Relaxaurus",
    "Mammorest": "Helzephyr",
    "Mammorest Cryst": "Helzephyr",
    "Wumpo": "Relaxaurus",
    "Wumpo Botan": "Relaxaurus",
    "Warsect": "Beakon",
    "Fenglope": "Elphidran",
    "Felbat": "Surfent",
    "Quivern": "Beakon",
    "Blazamut": "Suzaku",
    "Helzephyr": "Astegon",
    "Astegon": "Cryolinx",
    "Menasting": "Helzephyr",
    "Anubis": "Elizabee",
    "Jormuntide": "Beakon",
    "Jormuntide Ignis": "Beakon",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Astegon",
    "Lyleen": "Helzephyr",
    "Lyleen Noct": "Astegon",
    "Faleris": "Beakon",
    "Orserk": "Cryolinx",
    "Shadowbeak": "Suzaku",
    "Paladius": "Suzaku",
    "Necromus": "Suzaku",
    "Frostallion": "Cryolinx",
    "Frostallion Noct": "Frostallion Noct",
    "Jetragon": "Cryolinx"
  },
  "Jetragon": {
    "Lamball": "Petallia",
    "Cattiva": "Petallia",
    "Chikipi": "Arsox",
    "Lifmunk": "Foxcicle",
    "Foxparks": "Tombat",
    "Fuack": "Blazehowl",
    "Sparkit": "Tombat",
    "Tanzee": "Univolt",
    "Rooby": "Bushi",
    "Pengullet": "Blazehowl",
    "Penking": "Jormuntide",
    "Jolthog": "Rayhound",
    "Jolthog Cryst": "Rayhound",
    "Gumoss": "Vanwyrm",
    "Gumoss (Special)": "Vanwyrm",
    "Vixy": "Foxcicle",
    "Hoocrates": "Rayhound",
    "Teafant": "Arsox",
    "Depresso": "Rayhound",
    "Cremis": "Petallia",
    "Daedream": "Vanwyrm",
    "Rushoar": "Incineram",
    "Nox": "Bushi",
    "Fuddler": "Vanwyrm",
    "Killamari": "Univolt",
    "Mau": "Arsox",
    "Mau Cryst": "Foxcicle",
    "Celaray": "Wumpo Botan",
    "Direhowl": "Anubis",
    "Tocotoco": "Blazehowl",
    "Flopie": "Univolt",
    "Mozzarina": "Azurobe",
    "Bristla": "Blazehowl",
    "Gobfin": "Incineram",
    "Gobfin Ignis": "Incineram",
    "Hangyu": "Tombat",
    "Hangyu Cryst": "Foxcicle",
    "Mossanda": "Menasting",
    "Mossanda Lux": "Beakon",
    "Woolipop": "Bushi",
    "Caprity": "Grintale",
    "Melpaca": "Cinnamoth",
    "Eikthyrdeer": "Azurobe",
    "Eikthyrdeer Terra": "Azurobe",
    "Nitewing": "Menasting",
    "Ribunny": "Katress",
    "Incineram": "Warsect",
    "Incineram Noct": "Elizabee",
    "Cinnamoth": "Relaxaurus",
    "Arsox": "Sibelyx",
    "Dumud": "Cinnamoth",
    "Cawgnito": "Incineram",
    "Leezpunk": "Incineram",
    "Leezpunk Ignis": "Incineram",
    "Loupmoon": "Penking",
    "Galeclaw": "Surfent",
    "Robinquill": "Surfent",
    "Robinquill Terra": "Elphidran",
    "Gorirat": "Anubis",
    "Beegarde": "Anubis",
    "Elizabee": "Beakon",
    "Grintale": "Mammorest",
    "Swee": "Katress",
    "Sweepa": "Menasting",
    "Chillet": "Sibelyx",
    "Univolt": "Ragnahawk",
    "Foxcicle": "Nitewing",
    "Pyrin": "Beakon",
    "Pyrin Noct": "Astegon",
    "Reindrix": "Wumpo Botan",
    "Rayhound": "Nitewing",
    "Kitsun": "Wumpo",
    "Dazzi": "Vanwyrm",
    "Lunaris": "Incineram",
    "Dinossom": "Sibelyx",
    "Dinossom Lux": "Sibelyx",
    "Surfent": "Reptyro",
    "Surfent Terra": "Reptyro",
    "Maraith": "Bushi",
    "Digtoise": "Kingpaca",
    "Tombat": "Nitewing",
    "Lovander": "Penking",
    "Flambelle": "Tombat",
    "Vanwyrm": "Ragnahawk",
    "Vanwyrm Cryst": "Pyrin",
    "Bushi": "Pyrin",
    "Beakon": "Astegon",
    "Ragnahawk": "Beakon",
    "Katress": "Sweepa",
    "Wixen": "Bushi",
    "Verdash": "Elphidran",
    "Vaelet": "Anubis",
    "Sibelyx": "Relaxaurus",
    "Elphidran": "Jormuntide",
    "Elphidran Aqua": "Jormuntide",
    "Kelpsea": "Univolt",
    "Kelpsea Ignis": "Univolt",
    "Azurobe": "Mammorest",
    "Cryolinx": "Cryolinx",
    "Blazehowl": "Sweepa",
    "Blazehowl Noct": "Ragnahawk",
    "Relaxaurus": "Helzephyr",
    "Relaxaurus Lux": "Helzephyr",
    "Broncherry": "Wumpo Botan",
    "Broncherry Aqua": "Wumpo",
    "Petallia": "Mossanda",
    "Reptyro": "Beakon",
    "Ice Reptyro": "Astegon",
    "Kingpaca": "Relaxaurus",
    "Ice Kingpaca": "Menasting",
    "Mammorest": "Helzephyr",
    "Mammorest Cryst": "Helzephyr",
    "Wumpo": "Relaxaurus",
    "Wumpo Botan": "Relaxaurus",
    "Warsect": "Beakon",
    "Fenglope": "Elphidran",
    "Felbat": "Elphidran",
    "Quivern": "Beakon",
    "Blazamut": "Suzaku",
    "Helzephyr": "Cryolinx",
    "Astegon": "Cryolinx",
    "Menasting": "Helzephyr",
    "Anubis": "Elizabee",
    "Jormuntide": "Helzephyr",
    "Jormuntide Ignis": "Helzephyr",
    "Suzaku": "Suzaku",
    "Suzaku Aqua": "Suzaku",
    "Grizzbolt": "Astegon",
    "Lyleen": "Astegon",
    "Lyleen Noct": "Astegon",
    "Faleris": "Beakon",
    "Orserk": "Cryolinx",
    "Shadowbeak": "Suzaku",
    "Paladius": "Suzaku",
    "Necromus": "Suzaku",
    "Frostallion": "Cryolinx",
    "Frostallion Noct": "Cryolinx",
    "Jetragon": "Jetragon"
  }
});

/***/ }),

/***/ "./src/breedpath.js":
/*!**************************!*\
  !*** ./src/breedpath.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loader */ "./src/loader.js");
/* harmony import */ var _breeding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./breeding */ "./src/breeding.js");




(0,_loader__WEBPACK_IMPORTED_MODULE_0__.onPageLoaded)(() => {
    const breedPath = document.querySelector("div.breed-path");
    const pathElem = breedPath.querySelector("div#path");
    const [ startSelect, resultSelect ] = breedPath.querySelectorAll("select.pals");
    const calculate = document.querySelector("button#calc");
    
    function outputMessage(message) {
        const p = document.createElement("p");
        p.textContent = message;
        pathElem.appendChild(p);
    }
    
    calculate.onclick = () => {
        pathElem.innerHTML = "";
        const startName = startSelect.item(startSelect.selectedIndex).value;
        const resultName = resultSelect.item(resultSelect.selectedIndex).value;

        const uniqueCombos = _breeding__WEBPACK_IMPORTED_MODULE_1__["default"].getUniqueCombos();
        if (uniqueCombos.includes(resultName)) {
            outputMessage(`Only two ${resultName} can produce a ${resultName}.`);
            return;
        }

        const breedSet = _breeding__WEBPACK_IMPORTED_MODULE_1__["default"].findResultFromName(startName, resultName);
        if (breedSet.length == 0) {
            outputMessage(`You cannot make a ${resultName} from a ${startName}.`);
            return;
        }

        let fullPath = [];
        let last = startName;
        for (let i in breedSet) {
            const { mate, result } = breedSet[i];
            fullPath.push(`${last} + ${mate} = ${result}`);
            last = result;
        }

        fullPath.forEach((str) => {
            const p = document.createElement("p");
            p.textContent = str;
            pathElem.appendChild(p);
        })
    }

});

/***/ }),

/***/ "./src/deferred.js":
/*!*************************!*\
  !*** ./src/deferred.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Deferred)
/* harmony export */ });

class Deferred {
    constructor(callback) {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            if (callback)
                callback(this);
        });
    }
}

/***/ }),

/***/ "./src/dictionary.js":
/*!***************************!*\
  !*** ./src/dictionary.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActiveSkills: () => (/* binding */ ActiveSkills),
/* harmony export */   Element: () => (/* binding */ Element),
/* harmony export */   PalNames: () => (/* binding */ PalNames),
/* harmony export */   PassiveSkills: () => (/* binding */ PassiveSkills),
/* harmony export */   WorkerSick: () => (/* binding */ WorkerSick),
/* harmony export */   XPThresholds: () => (/* binding */ XPThresholds)
/* harmony export */ });
// Also note that HP has 3 following 0s
// MP is SAN
// CraftSpeed is BEFORE passives are added
// "IsRarePal" is "shiny"

// index is level - 1
const XPThresholds = [
  0, 25, 56, 93, 138, 207, 306, 440, 616, 843,
  1131, 1492, 1941, 2495, 3175, 4007, 5021, 6253, 7747, 9555,
  11740, 14378, 17559, 21392, 26007, 31561, 38241, 46272, 55925, 67524,
  81458, 98195, 118294, 142429, 171406, 206194, 247955, 298134, 358305, 430525,
  517205, 621236, 746089, 895928, 1075751, 1291554, 1550533, 1861323, 2234286, 2681857
];

// each number beats the number under it
// with the exception of Grass which is beaten by fire
const Element = {
  Neutral: 0,
  Dark: 1,
  Dragon: 2,
  Ice: 3,
  Fire: 4,
  Water: 5,
  Electric: 6,
  Ground: 7,
  Grass: 8,
}

// Each skill is always prefixed with "EPalWazaID::"
const ActiveSkills = {
  SelfDestruct: { name: "Implode", element: Element.Neutral, ct: 55, power: 230 },
  PowerBall: { name: "Power Bomb", element: Element.Neutral, ct: 15, power: 70 },
  AcidRain: { name: "Acid Rain", element: Element.Water, ct: 18, power: 80 },
  AirCanon: { name: "Air Cannon", element: Element.Neutral, ct: 2, power: 25 },
  DragonBreath: { name: "Draconic Breath", element: Element.Dragon, ct: 15, power: 70 },
  PowerShot: { name: "Power Shot", element: Element.Neutral, ct: 4, power: 35 },
  SandTornado: { name: "Sand Tornado", element: Element.Ground, ct: 18, power: 80 },
  GrassTornado: { name: "Grass Tornado", element: Element.Grass, ct: 18, power: 80 },
  MudShot: { name: "Sand Blast", element: Element.Ground, ct: 4, power: 40 },
  WindCutter: { name: "Wind Cutter", element: Element.Grass, ct: 2, power: 30 },
  DarkBall: { name: "Dark Ball", element: Element.Dark, ct: 4, power: 40 },
  LightningStrike: { name: "Lightning Strike", element: Element.Electric, ct: 40, power: 12 },
  ThreeThunder: { name: "Tri-Lightning", element: Element.Electric, ct: 22, power: 90 },
  ElecWave: { name: "Shockwave", element: Element.Electric, ct: 4, power: 40 },
  ThunderFunnel: { name: "Plasma Tornado", element: Element.Electric, ct: 13, power: 65 },
  WaterGun: { name: "Water Gun", element: Element.Water, ct: 4, power: 40 },
  SpreadPulse: { name: "Spark Blast", element: Element.Electric, ct: 2, power: 30 },
  ThunderBall: { name: "Electric Ball", element: Element.Electric, ct: 9, power: 50 },
  LineThunder: { name: "Lightning Streak", element: Element.Electric, ct: 16, power: 75 },
  Human_Punch: { name: "Punch", element: Element.Neutral, ct: 1, power: 12 },
  WaterBall: { name: "Aqua Burst", element: Element.Water, power: 100 },
  SelfDestruct_Bee: { name: "Bee Quiet", element: Element.Neutral, power: 200 },
  IcicleThrow: { name: "Blizzard Spike", element: Element.Ice, power: 130 },
  BubbleShot: { name: "Bubble Blast", element: Element.Water, power: 65 },
  CrossThunder: { name: "Cross Lightning", element: Element.Electric, power: 0 },
  FrostBreath: { name: "Cryst Breath", element: Element.Ice, power: 90 },
  DarkLaser: { name: "Dark Laser", element: Element.Dark, power: 150 },
  DarkLegion: { name: "Dark Whisp", element: Element.Dark, power: 0 },
  DragonWave: { name: "Dragon Burst", element: Element.Dragon, power: 55 },
  DragonCanon: { name: "Dragon Cannon", element: Element.Dragon, power: 30 },
  DragonMeteor: { name: "Dragon Meteor", element: Element.Dragon, power: 150 },
  FireBall: { name: "Fire Ball", element: Element.Fire, power: 150 },
  FlareArrow: { name: "Flare Arrow", element: Element.Fire, power: 55 },
  FlareTornado: { name: "Flare Storm", element: Element.Fire, power: 80 },
  AquaJet: { name: "Hydro Jet", element: Element.Water, power: 30 },
  HydroPump: { name: "Hydro Laser", element: Element.Water, power: 150 },
  IceMissile: { name: "Ice Missile", element: Element.Ice, power: 30 },
  BlizzardLance: { name: "Iceberg", element: Element.Ice, power: 70 },
  IceBlade: { name: "Icicle Cutter", element: Element.Ice, power: 55 },
  FireBlast: { name: "Ignis Blast", element: Element.Fire, power: 30 },
  Flamethrower: { name: "Ignis Breath", element: Element.Fire, power: 70 },
  Inferno: { name: "Ignis Rage", element: Element.Fire, power: 120 },
  Intimidate: { name: "Intimidate", element: Element.Neutral, power: 0 },
  Thunderbolt: { name: "Lightning Bolt", element: Element.Electric, power: 0 },
  ThunderRain: { name: "Lightning Rain", element: Element.Electric, power: 0 },
  LockonLaser: { name: "Lock-on Laser", element: Element.Electric, power: 0 },
  SelfExplosion: { name: "Megaton Implode", element: Element.Neutral, power: 0 },
  SpecialCutter: { name: "Multicutter", element: Element.Grass, power: 0 },
  ShadowBall: { name: "Nightmare Ball", element: Element.Dark, power: 100 },
  None: { name: "None", element: "Element.None", power: 0 },
  HyperBeam: { name: "Pal Blast", element: Element.Neutral, power: 150 },
  PoisonShot: { name: "Poison Blast", element: Element.Dark, power: 30 },
  PoisonFog: { name: "Poison Fog", element: Element.Dark, power: 0 },
  Psychokinesis: { name: "Psycho Gravity", element: Element.Dark, power: 0 },
  RockLance: { name: "Rock Lance", element: Element.Ground, power: 150 },
  SeedMachinegun: { name: "Seed Machine Gun", element: Element.Grass, power: 50 },
  SeedMine: { name: "Seed Mine", element: Element.Grass, power: 65 },
  DarkWave: { name: "Shadow Burst", element: Element.Dark, power: 55 },
  SolarBeam: { name: "Solar Blast", element: Element.Electric, power: 150 },
  RootAttack: { name: "Spine Vine", element: Element.Grass, power: 95 },
  FireSeed: { name: "Spirit Fire", element: Element.Fire, power: 45 },
  GhostFlame: { name: "Spirit Flame", element: Element.Dark, power: 75 },
  StoneShotgun: { name: "Stone Blast", element: Element.Ground, power: 55 },
  ThrowRock: { name: "Stone Cannon", element: Element.Ground, power: 70 },

  Unique_GrassPanda_Electric_ElectricPunch: { name: "Blast Punch", element: Element.Electric, power: 85 },
  Unique_AmaterasuWolf_FireCharge: { name: "Daring Flames", element: Element.Fire, power: 75 },
  Unique_FireKirin_Dark_DarkTossin: { name: "Dark Charge", element: Element.Dark, power: 85 },
  Unique_FengyunDeeper_CloudTempest: { name: "Cloud Tempest", element: Element.Neutral, power: 0 },
  Unique_SakuraSaurus_SideTackle: { name: "Muscle Slam", element: Element.Neutral, power: 80 },
  Unique_FairyDragon_FairyTornado: { name: "Mystic Whirlwind", element: Element.Dragon, power: 70 },
  Unique_BluePlatypus_Toboggan: { name: "Surfing Slam", element: Element.Water, power: 0 },
  Unique_HawkBird_Storm: { name: "Tornado Attack", element: Element.Neutral, power: 65 },
  Unique_BlackCentaur_TwoSpearRushes: { name: "Twin Spears", element: Element.Dark, power: 120 },
  Unique_VolcanicMonster_MagmaAttack: { name: "Volcanic Burst", element: Element.Fire, power: 100 },
  Unique_QueenBee_SpinLance: { name: "Spinning Lance", element: Element.Grass, power: 70 },
  Unique_Anubis_LowRoundKick: { name: "Spinning Roundhouse", element: Element.Ground, power: 100 },
  Unique_DrillGame_ShellAttack: { name: "Shell Spin", element: Element.Ground, power: 65 },
  Unique_SaintCentaur_OneSpearRushes: { name: "Spear Thrust", element: Element.Neutral, power: 120 },
  Unique_PinkCat_CatPunch: { name: "Punch Flurry", element: Element.Neutral, power: 40 },
  Unique_Boar_Tackle: { name: "Reckless Charge", element: Element.Neutral, power: 55 },
  Unique_DarkCrow_TelePoke: { name: "Phantom Peck", element: Element.Dark, power: 55 },
  Unique_Horus_FlareBird: { name: "Phoenix Flare", element: Element.Fire, power: 135 },
  Unique_Werewolf_Scratch: { name: "Jumping Claw", element: Element.Dark, power: 55 },
  Unique_ThunderDragonMan_ThunderSwordAttack: { name: "Kerauno", element: Element.Electric, power: 100 },
  Unique_KingAlpaca_BodyPress: { name: "Kingly Slam", element: Element.Neutral, power: 100 },
  Unique_Alpaca_Tackle: { name: "Fluffy Tackle", element: Element.Neutral, ct: 4, power: 40 },
  Unique_SheepBall_Roll: { name: "Roly Poly", element: Element.Neutral, ct: 1, power: 35 },
  Unique_Deer_PushupHorn: { name: "Antler Uppercut", element: Element.Neutral, ct: 5, power: 50 },
  Unique_Eagle_GlidingNail: { name: "Gale Claw", element: Element.Neutral, ct: 8, power: 80 },
  Unique_FlowerDinosaur_Whip: { name: "Botanical Smash", element: Element.Grass, ct: 8, power: 60 },
  Unique_JetDragon_JumpBeam: { name: "Beam Comet", element: Element.Dragon, power: 140 },
  Unique_FlameBuffalo_FlameHorn: { name: "Blazing Horn", element: Element.Fire, power: 50 },
  Unique_NaughtyCat_CatPress: { name: "Cat Press", element: Element.Neutral, power: 60 },
  Unique_ChickenPal_ChickenPeck: { name: "Chicken Rush", element: Element.Neutral, power: 30 },
  Unique_BlackGriffon_TackleLaser: { name: "Divine Disaster", element: Element.Dark, power: 160 },
  Unique_Grassmammoth_Earthquake: { name: "Earth Impact", element: Element.Ground, power: 100 },
  Unique_CaptainPenguin_BodySlide: { name: "Emperor Slide", element: Element.Ice, power: 70 },
  Unique_Garm_Bite: { name: "Fierce Fang", element: Element.Neutral, power: 45 },
  Unique_RobinHood_BowSnipe: { name: "Focus Shot", element: Element.Grass, power: 65 },
  Unique_Anubis_Tackle: { name: "Forceful Charge", element: Element.Ground, power: 120 },
  Unique_IceDeer_IceHorn: { name: "Freezing Charge", element: Element.Ice, power: 65 },
  Unique_VolcanicMonster_Ice_IceAttack: { name: "Frost Burst", element: Element.Ice, power: 100 },
  Unique_HerculesBeetle_BeetleTackle: { name: "Giga Horn", element: Element.Ground, power: 75 },
  Unique_Gorilla_GroundPunch: { name: "Ground Pound", element: Element.Neutral, power: 85 },
  Unique_Anubis_GroundPunch: { name: "Ground Smash", element: Element.Ground, power: 140 },
  Unique_Baphomet_SwallowKite: { name: "Hellfire Claw", element: Element.Fire, power: 70 },
  Unique_Kirin_LightningTackle: { name: "Lightning Tackle", element: Element.Electric, power: 0 },
  Unique_ElecPanda_ElecScratch: { name: "Lightning Claw", element: Element.Electric, power: 90 },
  Unique_GrassPanda_MusclePunch: { name: "Crushing Punch", element: Element.Grass, power: 85 },
  Unique_IceHorse_IceBladeAttack: { name: "Crystal Wing", element: Element.Ice, power: 110 },
  Unique_FireKirin_Tackle: { name: "Ignis Slam", element: Element.Fire, power: 85 },
  Unique_Ronin_Iai: { name: "Iaigiri", element: Element.Fire, power: 65 },
}

const WorkerSick = {
  "EPalBaseCampWorkerSickType::Weakness": "Weakness"
}

// "BOSS_" prefix can mean Shiny or Alpha
// When we parse the names we can be sure to remove it...
const PalNames = {
  SheepBall: "Lamball",
  PlantSlime: "Gumoss",
  ChickenPal: "Chikipi",
  Sheepball: "Lamball",
  Kitsunebi: "Foxparks",
  QueenBee: "Elizabee",
  PinkLizard: "Lovander",
  Alpaca: "Melpaca",
  Deer: "Eikthyrdeer",
  Eagle: "Galeclaw",
  CuteMole: "Fuddler",
  Bastet: "Mau",
  Mutant: "Lunaris",
  BluePlatypus: "Fuack",
  FlowerDinosaur: "Dinossom",
  FlowerDinosaur_Electric: "Dinossom Lux",
  SweetsSheep: "Woolipop",
  GrassRabbitMan: "Verdash",
  ThunderDog: "Rayhound",
  FlameBuffalo: "Arsox",
  Serpent: "Surfent",
  MopBaby: "Swee",
  MopKing: "Sweepa",
  GrassPanda: "Mossanda",
  GrassPanda_Electric: "Mossanda Lux",
  LilyQueen: "Lyleen",
  BlackMetalDragon: "Astegon",
  SaintCentaur: "Paladius",
  JetDragon: "Jetragon",
  BlackCentaur: "Necromus",
  IceHorse: "Frostallion",
  IceFox: "Foxcicle",
  Suzaku: "Suzaku",
  Umihebi: "Jormuntide",
  Bastet_Ice: "Mau Cryst",
  SharkKid: "Gobfin",
  Anubis: "Anubis",
  SkyDragon: "Quivern",
  FlyingManta: "Celaray",
  HawkBird: "Nitewing",
  LizardMan: "Leezpunk",
  Baphomet: "Incineram",
  Baphomet_Dark: "Incineram Noct",
  PinkRabbit: "Ribbunny",
  NegativeOctopus: "Killamari",
  HerculesBeetle: "Warsect",
  Manticore: "Blazehowl", // Assumed
  Manticore_Dark: "Blazehowl Noct",
  PinkCat: "Cattiva",
  Carbunclo: "Lifmunk",
  ElecCat: "Sparkit",
  Monkey: "Tanzee",
  FlameBambi: "Rooby",
  Penguin: "Pengullet",
  CaptainPenguin: "Penking",
  Hedgehog: "Jolthog",
  Hedgehog_Ice: "Jolthog Cryst",
  CuteFox: "Vixy",
  WizardOwl: "Hoocrates",
  NegativeKoala: "Depresso",
  WoolFox: "Cremis",
  DreamDemon: "Daedream",
  Boar: "Rushoar",
  NightFox: "Nox",
  Garm: "Direhowl",
  ColorfulBird: "Tocotoco",
  FlowerRabbit: "Flopie",
  CowPal: "Mozzarina",
  LittleBriarRose: "Bristla",
  WindChimes: "Hangyu", // assumed
  WindChimes_Ice: "Hangyu Cryst",
  BerryGoat: "Caprity",
  CuteButterfly: "Cinnamoth",
  LazyCatfish: "Dumud",
  LizardMan_Fire: "Leezpunk Ignis",
  Werewolf: "Loupmoon",
  RobinHood: "Robinquill",
  RobinHood_Ground: "Robinquill Terra",
  Gorilla: "Gorirat",
  SoldierBee: "Beegarde",
  NaughtyCat: "Grintale",
  WeaselDragon: "Chillet",
  Kirin: "Univolt",
  FireKirin: "Pyrin",
  FireKirin_Dark: "Pyrin Noct",
  AmaterasuWolf: "Kitsun",
  RaijinDaughter: "Dazzi",
  Serpent_Ground: "Surfent Terra",
  GhostBeast: "Maraith",
  DrillGame: "Digtoise",
  CatBat: "Tombat",
  LavaGirl: "Flambelle",
  BirdDragon: "Vanwyrm",
  BirdDragon_Ice: "Vanwyrm Cryst",
  ThunderBird: "Beakon",
  CatMage: "Katress",
  VioletFairy: "Vaelet",
  WhiteMoth: "Sibelyx",
  Kelpie: "Kelpsea",
  Kelpie_Fire: "Kelpsea Ignis",
  BlueDragon: "Azurobe",
  Ronin: "Bushi",
  WhiteTiger: "Cryolinx",
  LazyDragon: "Relaxaurus",
  LazyDragon_Electric: "Relaxaurus Lux",
  SakuraSaurus: "Broncherry",
  SakuraSaurus_Water: "Broncherry Aqua",
  FlowerDoll: "Petallia",
  VolcanicMonster: "Reptyro",
  VolcanicMonster_Ice: "Ice Reptyro",
  KingAlpaca: "Kingpaca",
  KingAlpaca_Ice: "Kingpaca Cryst",
  Yeti: "Wumpo",
  Yeti_Grass: "Wumpo Botan",
  FengyunDeeper: "Fenglope",
  CatVampire: "Felbat",
  KingBahamut: "Blazamut",
  HadesBird: "Helzephyr",
  DarkScorpion: "Menasting",
  DarkCrow: "Cawgnito",
  Umihebi_Fire: "Jormuntide Ignis",
  Suzaku_Water: "Suzaku Aqua",
  ElecPanda: "Grizzbolt",
  LilyQueen_Dark: "Lyleen Noct",
  Horus: "Faleris",
  ThunderDragonMan: "Orserk",
  BlackGriffon: "Shadowbeak",
  IceHorse_Dark: "Frostallion Noct",
  Deer_Ground: "Eikthyrdeer Terra",
  FairyDragon: "Elphidran",
  IceDeer: "Reindrix",
  FairyDragon_Water: "Elphidran Aqua",
  FoxMage: "Wixen",
  Ganesha: "Teafant",
  GrassMammoth: "Mammorest",
  GrassMammoth_Ice: "Mammorest Cryst",
  RedArmorBird: "Ragnahawk",
  SharkKid_Fire: "Gobfin Ignis",

  lookup(characterId) {
    if (!characterId)
      return undefined;

    let name = characterId.replace("BOSS_", "");
    if (name === "Sheepball")
      name = "SheepBall";

    if (!Object.keys(this).includes(name))
      return undefined;

    return this[name];
  }
};

const PassiveSkills = {
  ElementResist_Aqua_1_PAL: { name: "Waterproof", desc: "10.0% decrease to incoming Water damage", good: true, tier: 1 },
  ElementResist_Ice_1_PAL: { name: "Heated Body", desc: "10.0% decrease to incoming Ice damage", good: true, tier: 1 },
  ElementResist_Normal_1_PAL: { name: "Abnormal", desc: "10.0% decrease to incoming Neutral damage", good: true, tier: 1 },
  ElementResist_Earth_1_PAL: { name: "Earthquake Resistant", desc: "10.0% decrease to incoming Earth damage", good: true, tier: 1 },
  ElementResist_Leaf_1_PAL: { name: "Botanical Barrier", desc: "10.0% decrease to incoming Grass damage", good: true, tier: 1 },
  ElementResist_Thunder_1_PAL: { name: "Insulated Body", desc: "10.0% decrease to incoming Lightning damage", good: true, tier: 1 },
  ElementResist_Dragon_1_PAL: { name: "Dragonkiller", desc: "10.0% decrease to incoming Dragon damage", good: true, tier: 1 },
  ElementResist_Fire_1_PAL: { name: "Suntan Lover", desc: "10.0% decrease to incoming Fire damage", good: true, tier: 1 },
  ElementResist_Dark_1_PAL: { name: "Cheery", desc: "10.0% decrease to incoming Dark damage", good: true, tier: 1 },

  ElementBoost_Earth_1_PAL: { name: "Power of Gaia", desc: "10.0% increase to Earth attack damage", good: true, tier: 1 },
  ElementBoost_Thunder_1_PAL: { name: "Capacitor", desc: "10.0% increase to Lightning attack damage", good: true, tier: 1 },
  ElementBoost_Fire_1_PAL: { name: "Pyromaniac", desc: "10.0% increase to Fire attack damage", good: true, tier: 1 },
  ElementBoost_Dragon_1_PAL: { name: "Blood of the Dragon", desc: "10.0% increase to Dragon attack damage", good: true, tier: 1 },
  ElementBoost_Normal_1_PAL: { name: "Zen Mind", desc: "10.0% increase to Neutral attack damage", good: true, tier: 1 },
  ElementBoost_Leaf_1_PAL: { name: "Fragrant Foliage", desc: "10.0% increase to Grass attack damage", good: true, tier: 1 },
  ElementBoost_Dark_1_PAL: { name: "Veil of Darkness", desc: "10.0% increase to Dark attack damage", good: true, tier: 1 },
  ElementBoost_Aqua_1_PAL: { name: "Hydromaniac", desc: "10.0% increase to Water attack damage", good: true, tier: 1 },
  ElementBoost_Ice_1_PAL: { name: "Coldblooded", desc: "10.0% increase to Ice attack damage", good: true, tier: 1 },

  ElementBoost_Normal_2_PAL: { name: "Celestial Emperor", desc: "20.0% increase to Neutral attack damage", good: true, tier: 3 },
  ElementBoost_Leaf_2_PAL: { name: "Spirit Emperor", desc: "20.0% increase to Grass attack damage", good: true, tier: 3 },
  ElementBoost_Dragon_2_PAL: { name: "Divine Dragon", desc: "20.0% increase to Dragon attack damage", good: true, tier: 3 },
  ElementBoost_Dark_2_PAL: { name: "Lord of the Underworld", desc: "20.0% increase to Dark attack damage", good: true, tier: 3 },
  ElementBoost_Ice_2_PAL: { name: "Ice Emperor", desc: "20.0% increase to Ice attack damage", good: true, tier: 3 },
  ElementBoost_Thunder_2_PAL: { name: "Lord of Lightning", desc: "20.0% increase to Lightning attack damage", good: true, tier: 3 },
  ElementBoost_Fire_2_PAL: { name: "Flame Emperor", desc: "20.0% increase to Fire attack damage", good: true, tier: 3 },
  ElementBoost_Aqua_2_PAL: { name: "Lord of the Sea", desc: "20.0% increase to Water attack damage", good: true, tier: 3 },
  ElementBoost_Earth_2_PAL: { name: "Earth Emperor", desc: "20.0% increase to Ground attack damage", good: true, tier: 3 },

  CraftSpeed_up2: { name: "Artisan", desc: "Work Speed +50%", good: true, tier: 3 },
  CraftSpeed_up1: { name: "Serious", desc: "Work Speed +20%", good: true, tier: 2 },

  CraftSpeed_down2: { name: "Slacker", desc: "Work Speed -30%", good: false, tier: 3 },
  CraftSpeed_down1: { name: "Clumsy", desc: "Work Speed -10%", good: false, tier: 2 },

  Legend: { name: "Legend", desc: "Attack +20.0%\nDefense +20.0%\nMovement Speed increases 15.0%", good: true, tier: 3 },
  Rare: { name: "Lucky", desc: "Work Speed +15%\nAttack +15%", good: true, tier: 3 },
  Noukin: { name: "Musclehead", desc: "Attack +30%\nWork Speed -50%", good: true, tier: 2 },

  PAL_FullStomach_Down_2: { name: "Diet Lover", desc: "Decrease in Hunger is less likely by +15.0%", good: true, tier: 3 },
  PAL_FullStomach_Down_1: { name: "Dainty Eater", desc: "Satiety drops +10% slower", good: true, tier: 1 },
  PAL_FullStomach_Up_1: { name: "Glutton", desc: "Satiety drops +10% faster", good: false, tier: 1 },
  PAL_FullStomach_Up_2: { name: "Bottomless Stomach", desc: "Satiety drops +15% faster", good: false, tier: 2 },

  PAL_CorporateSlave: { name: "Work Slave", desc: "Work Speed +30%\nAttack -30%", good: true, tier: 1 },
  PAL_conceited: { name: "Conceited", desc: "Work Speed +10%\nDefense -10%", good: true, tier: 1 },
  PAL_oraora: { name: "Aggressive", desc: "Attack +10%\nDefense -10%", good: true, tier: 1 },
  PAL_sadist: { name: "Sadist", desc: "Attack +15%\nDefense -15%", good: true, tier: 1 },
  PAL_rude: { name: "Hooligan", desc: "Attack +15%\nWork Speed -10%", good: true, tier: 1 },
  PAL_masochist: { name: "Masochist", desc: "Defense +15%\nAttack -15%", good: true, tier: 1 },

  MoveSpeed_up_3: { name: "Swift", desc: "30.0% increase to movement speed", good: true, tier: 3 },
  MoveSpeed_up_2: { name: "Runner", desc: "20.0% increase to movement speed", good: true, tier: 2 },
  MoveSpeed_up_1: { name: "Nimble", desc: "10.0% increase to movement speed", good: true, tier: 1 },

  TrainerATK_UP_1: { name: "Vanguard", desc: "10.0% increase to Player Attack", good: true, tier: 3 },
  TrainerDEF_UP_1: { name: "Stronghold Strategist", desc: "10.0% increase to Player Defense", good: true, tier: 3 },
  TrainerMining_up1: { name: "Mine Foreman", desc: "25.0% increase to Player Mining Efficiency", good: true, tier: 3 },
  TrainerLogging_up1: { name: "Logging Foreman", desc: "25.0% increase to Player Logging Efficiency", good: true, tier: 3 },
  TrainerWorkSpeed_UP_1: { name: "Motivational Leader", desc: "25.0% increase to Player Work Speed", good: true, tier: 3 },

  Deffence_up2: { name: "Burly Body", desc: "Defense +20%", good: true, tier: 3 },
  Deffence_up1: { name: "Hard Skin", desc: "Defense +10%", good: true, tier: 1 },
  Deffence_down1: { name: "Downtrodden", desc: "Defense -10%", good: false, tier: 1 },
  Deffence_down2: { name: "Brittle", desc: "Defense -20%", good: false, tier: 3 },

  PAL_ALLAttack_up2: { name: "Ferocious", desc: "Attack +20%", good: true, tier: 3 },
  PAL_ALLAttack_up1: { name: "Brave", desc: "Attack +10%", good: true, tier: 1 },
  PAL_ALLAttack_down1: { name: "Coward", desc: "Attack -10%", good: false, tier: 1},
  PAL_ALLAttack_down2: { name: "Pacifist", desc: "Attack -20%", good: false, tier: 3 },

  PAL_Sanity_Up_2: { name: "Destructive", desc: "SAN drops +15% faster", good: false, tier: 2 },
  PAL_Sanity_Up_1: { name: "Unstable", desc: "SAN drops +10% faster", good: false, tier: 1 },
  PAL_Sanity_Down_1: { name: "Positive Thinker", desc: "SAN drops +10% slower", good: true, tier: 1 },
  PAL_Sanity_Down_2: { name: "Workaholic", desc: "SAN drops +15% slower", good: true, tier: 3 },
};


/***/ }),

/***/ "./src/dragdrop.js":
/*!*************************!*\
  !*** ./src/dragdrop.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loader */ "./src/loader.js");

let enterCallback, leaveCallback, overCallback, dropCallback;
let errorHandler;

(0,_loader__WEBPACK_IMPORTED_MODULE_0__.onPageLoaded)(async () => {
    const dragText = document.querySelector("div.drag-enter");
    const content = document.querySelector("div.content");
    const errorElem = document.querySelector("div.error");
    const errorText = document.querySelector("p.error-text");

    errorElem.addEventListener("transitionend", (e) => {
        if (errorElem.classList.contains("hide"))
            errorElem.style.opacity = "0";
    })

    errorElem.addEventListener("transitionstart", (e) => {
        if (errorElem.classList.contains("show"))
            errorElem.style.opacity = "1";
    })

    const onDragEnter = function(e) {
        e.preventDefault();
        e.stopPropagation();

        dragText.classList.add("show");
        content.classList.add("drag");

        if (enterCallback)
            enterCallback(e);
    }

    const onDragLeave = function(e) {
        e.preventDefault();
        e.stopPropagation();

        dragText.classList.remove("show");
        content.classList.remove("drag");

        if (leaveCallback)
            leaveCallback(e);
    }

    const onDragOver = function(e) {
        e.preventDefault();
        e.stopPropagation();

        dragText.classList.add("show");
        content.classList.add("drag");

        if (overCallback)
            overCallback(e);
    }

    const onDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();

        dragText.classList.remove("show");
        content.classList.remove("drag");

        if (dropCallback)
            dropCallback(e);
    }

    errorHandler = function(err) {
        errorText.textContent = err;
        errorElem.classList.replace("hide", "show");
        setTimeout(() => {
            errorElem.classList.replace("show", "hide");
        }, 10000);
    }

    document.body.addEventListener("dragenter", onDragEnter, false);
    document.body.addEventListener("dragleave", onDragLeave, false);
    document.body.addEventListener("dragover", onDragOver, false);
    document.body.addEventListener("drop", onDrop, false);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    /**
     * @param {(ev: DragEvent)} value Callback for drop event
     */
    set onDrop(value) { dropCallback = value; },

    /**
     * @param {(ev: DragEvent)} value Callback for dragenter event
     */
    set onDragEnter(value) { enterCallback = value; },

    /**
     * @param {(ev: DragEvent)} value Callback for dragleave event
     */
    set onDragLeave(value) { leaveCallback = value; },
    
    /**
     * @param {(ev: DragEvent)} value Callback for dragover event
     */
    set onDragOver(value) { overCallback = value; },

    error(err) {
        if (!errorHandler)
            return;

        errorHandler(err);
    }
});

/***/ }),

/***/ "./src/inventory.js":
/*!**************************!*\
  !*** ./src/inventory.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loader */ "./src/loader.js");
/* harmony import */ var _pal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pal */ "./src/pal.js");
/* harmony import */ var _viewer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./viewer */ "./src/viewer.js");
// Pal Inventory




/** @type {HTMLDivElement} */
let inventory;

/** @type {HTMLDivElement} */
let palList;

/**
 * @param {Pal} pal 
 */
function Item(pal) {
    const item = document.createElement("div");
    item.classList.add("item");

    const info = document.createElement("div");
    info.classList.add("info");
    item.appendChild(info);

    const image = document.createElement("img");
    image.draggable = false;
    image.src = `images/pals/${pal.id}${pal.variant ? "b" : ""}.webp`;
    image.classList.add("pal");
    info.appendChild(image);

    const level = document.createElement("span");
    level.classList.add("level");
    level.textContent = pal.level;
    info.appendChild(level);

    const name = document.createElement("span");
    name.classList.add("name");
    name.textContent = pal.name;
    info.appendChild(name);

    const elements = document.createElement("div");
    elements.classList.add("elements");
    item.appendChild(elements);

    const element = document.createElement("img");
    element.src = `images/element/${pal.type}.webp`;
    element.classList.add("element");
    element.draggable = false;
    elements.appendChild(element);

    if (pal.sub) {
        const subElement = document.createElement("img");
        subElement.src = `images/element/${pal.sub}.webp`;
        subElement.classList.add("element");
        subElement.draggable = false;
        elements.appendChild(subElement);
    }

    return item;
}

const load = (0,_loader__WEBPACK_IMPORTED_MODULE_0__.onPageLoaded)(() => {
    inventory = document.querySelector("div.inventory");
    palList = inventory.querySelector("div.pal-list");
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    /**
     * Adds a pal object to the inventory display
     * @param {Pal} pal 
     */
    addItem(pal) {
        load.then(() => {
            const item = Item(pal);
            item.addEventListener("click", () => {
                palList.querySelectorAll("div.item")
                    .forEach((elem) => elem.classList.remove("active"));

                item.classList.add("active");
                _viewer__WEBPACK_IMPORTED_MODULE_2__["default"].selectedPal = pal;
            });

            palList.appendChild(item);
        });
    },

    setSelected(i) {
        load.then(() => {
            const itemList = palList.querySelectorAll("div.item");
            itemList.forEach((elem) => elem.classList.remove("active"));

            if (!itemList[i])
                return;

            itemList[i].classList.add("active");
            itemList[i].click();
        });
    },


    // TODO: Sort by name, element, level...
    // Unfortunately we can't sort by the information inside the element
    // but we should create a Search button for specific pals
    // then we should create a new inventory list for the results
    // with a "close" button so you can return to the original list...
    sort(fn) {
        load.then(() => {
            const items = [];

        })
    }
});

/***/ }),

/***/ "./src/loader.js":
/*!***********************!*\
  !*** ./src/loader.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onPageLoaded: () => (/* binding */ onPageLoaded)
/* harmony export */ });


function onPageLoaded(callback) {
    let qResolve, qReject;
    const promise = new Promise(function (resolve, reject) {
        qResolve = resolve;
        qReject = reject;
    });

    const onLoad = () => {
        if (document.readyState !== "loading") {
            try {
                callback();
                qResolve();
            } catch (e) {
                qReject(e);
            }
        } else
            setTimeout(onLoad, 50);
    }

    setTimeout(onLoad, 50);
    return promise;
}

/***/ }),

/***/ "./src/mostoptimal.js":
/*!****************************!*\
  !*** ./src/mostoptimal.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loader */ "./src/loader.js");
/* harmony import */ var _breeding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./breeding */ "./src/breeding.js");



(0,_loader__WEBPACK_IMPORTED_MODULE_0__.onPageLoaded)(() => {
    const mostOptimal = document.querySelector("div.most-optimal");
    const palSelect = mostOptimal.querySelector("select.pals");
    const traits = mostOptimal.querySelectorAll("select.traits");
    const calculate = mostOptimal.querySelector("button.calculate");

    calculate.addEventListener("click", () => {
        const desiredPal = palSelect.value;
        const desiredTraits = [];

        for (let i = 0; i < 4; i++)
            if (traits[i].value !== "none")
                desiredTraits.push(traits[i].value);

        console.log("Getting pals with " + desiredTraits.join(", "));

        const traitedPals = _breeding__WEBPACK_IMPORTED_MODULE_1__["default"].getSavedPals(desiredTraits);
        console.log(traitedPals);

        // get all pals with any number of any of the traits
    })
})

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({

});

/***/ }),

/***/ "./src/pal.js":
/*!********************!*\
  !*** ./src/pal.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Pal)
/* harmony export */ });
/* harmony import */ var _dictionary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dictionary */ "./src/dictionary.js");
/* harmony import */ var _palstats__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./palstats */ "./src/palstats.js");



class Pal {
    /**
     * Creates a Pal object from the savedata
     * @param {any} pal 
     */
    constructor(pal) {
        const name = _dictionary__WEBPACK_IMPORTED_MODULE_0__.PalNames.lookup(pal.CharacterID);
        const palStats = _palstats__WEBPACK_IMPORTED_MODULE_1__["default"][name];

        this.name = name;
        this.id = palStats.id;
        this.variant = palStats.variant ?? false;
        this.gender = pal.Gender === "EPalGenderType::Male" ? "male" : "female";
        this.type = palStats.mainType;
        this.sub = palStats.subType;
        
        const totalExp = pal.Exp;
        this.level = _dictionary__WEBPACK_IMPORTED_MODULE_0__.XPThresholds.findIndex((v) => v > totalExp);
        if (this.level === -1)
            this.level = 50;

        const expToNextLevel = _dictionary__WEBPACK_IMPORTED_MODULE_0__.XPThresholds[this.level] - _dictionary__WEBPACK_IMPORTED_MODULE_0__.XPThresholds[this.level - 1];
        this.exp = totalExp - _dictionary__WEBPACK_IMPORTED_MODULE_0__.XPThresholds[this.level - 1];
        this.remainingExp = expToNextLevel - this.exp;

        this.health = pal.HP.Value / 1000;
        this.maxHealth = pal.MaxHP.Value / 1000;
        this.satiety = pal.FullStomach ?? 100;
        this.maxSatiety = pal.MaxFullStomach ?? 100;

        this.sanity = (pal.MP?.Value / 1000) ?? 100;

        // this is the condenser rank (stars)
        this.rank = pal.Rank ?? 1;

        // these are the statue ranks (+30% at 10)
        this.rankAttack = pal.Rank_Attack ?? 0;
        this.rankDefense = pal.Rank_Defence ?? 0;
        this.rankHp = pal.Rank_HP ?? 0;
        this.rankCraftSpeed = pal.Rank_CraftSpeed ?? 0;
        this.rankTotal = this.rankAttack + this.rankDefense + this.rankHp + this.rankCraftSpeed;

        // TODO: Figure out how these equate to the ingame stats
        this.meleeAttack = pal.Talent_Melee;
        this.rangedAttack = pal.Talent_Shot;
        this.attack = this.meleeAttack;
        this.defense = pal.Talent_Defense;
        this.workSpeed = pal.CraftSpeed; // TODO: Implement the passives

        const suits = pal.CraftSpeeds.Values;
        this.suitabilities = {
            kindling: suits[0].Rank,
            watering: suits[1].Rank,
            planting: suits[2].Rank,
            electric: suits[3].Rank,
            handiwork: suits[4].Rank,
            gathering: suits[5].Rank,
            logging: suits[6].Rank,
            mining: suits[7].Rank,
            medicine: suits[9].Rank,
            cooling: suits[10].Rank,
            transport: suits[11].Rank,
            farming: suits[12].Rank
        };

        // If they are a 4-star then their suitabilities go up by 1
        if (this.rank === 5) {
            Object.entries(this.suitabilities).forEach(([ suit, rank ]) => {
                if (rank > 0)
                    this.suitabilities[suit] += 1;
            })
        }

        this.passives = [];
        pal.PassiveSkillList?.forEach((passive, i) => 
            this.passives[i] = {
                id: passive,
                ..._dictionary__WEBPACK_IMPORTED_MODULE_0__.PassiveSkills[passive]
            }
        );
    }
}

/***/ }),

/***/ "./src/palstats.js":
/*!*************************!*\
  !*** ./src/palstats.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  "Blazamut": {
    "id": 96,
    "mainType": "Fire",
    "kindling": 3,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 4,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 9,
    "rank": 10,
    "HP": 100,
    "melee": 150,
    "shot": 125,
    "defense": 120,
    "price": 10520,
    "walkSpeed": 400,
    "runSpeed": 700,
    "maxSpeed": 900,
    "captureRate": 1
  },
  "Suzaku Aqua": {
    "id": 102,
    "variant": true,
    "mainType": "Water",
    "kindling": 0,
    "watering": 3,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 8,
    "rank": 30,
    "HP": 125,
    "melee": 100,
    "shot": 105,
    "defense": 105,
    "price": 10110,
    "walkSpeed": 200,
    "runSpeed": 850,
    "maxSpeed": 1000,
    "captureRate": 1
  },
  "Suzaku": {
    "id": 102,
    "mainType": "Fire",
    "kindling": 3,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 8,
    "rank": 50,
    "HP": 120,
    "melee": 100,
    "shot": 105,
    "defense": 105,
    "price": 9840,
    "walkSpeed": 200,
    "runSpeed": 850,
    "maxSpeed": 1000,
    "captureRate": 1
  },
  "Shadowbeak": {
    "id": 107,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 8,
    "rank": 60,
    "HP": 120,
    "melee": 130,
    "shot": 120,
    "defense": 140,
    "price": 9060,
    "walkSpeed": 80,
    "runSpeed": 850,
    "maxSpeed": 1000,
    "captureRate": 1
  },
  "Necromus": {
    "id": 109,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 2,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 9,
    "rank": 70,
    "HP": 130,
    "melee": 100,
    "shot": 145,
    "defense": 120,
    "price": 8930,
    "walkSpeed": 350,
    "runSpeed": 900,
    "maxSpeed": 1600,
    "captureRate": 1
  },
  "Paladius": {
    "id": 108,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 2,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 9,
    "rank": 80,
    "HP": 130,
    "melee": 110,
    "shot": 120,
    "defense": 145,
    "price": 8810,
    "walkSpeed": 100,
    "runSpeed": 800,
    "maxSpeed": 1400,
    "captureRate": 1
  },
  "Jetragon": {
    "id": 111,
    "mainType": "Dragon",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 3,
    "lumbering": 0,
    "mining": 0,
    "Oil": 3,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 9,
    "rank": 90,
    "HP": 110,
    "melee": 100,
    "shot": 140,
    "defense": 110,
    "price": 8680,
    "walkSpeed": 800,
    "runSpeed": 1700,
    "maxSpeed": 3300,
    "captureRate": 1
  },
  "Frostallion Noct": {
    "variant": true,
    "id": 110,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 4,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 100,
    "HP": 140,
    "melee": 100,
    "shot": 140,
    "defense": 135,
    "price": 8560,
    "walkSpeed": 120,
    "runSpeed": 1000,
    "maxSpeed": 1400,
    "captureRate": 1
  },
  "Frostallion": {
    "id": 110,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 4,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 120,
    "HP": 140,
    "melee": 100,
    "shot": 140,
    "defense": 120,
    "price": 8440,
    "walkSpeed": 120,
    "runSpeed": 1000,
    "maxSpeed": 1400,
    "captureRate": 1
  },
  "Cryolinx": {
    "id": 83,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 3,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 130,
    "HP": 100,
    "melee": 140,
    "shot": 100,
    "defense": 110,
    "price": 8440,
    "walkSpeed": 280,
    "runSpeed": 720,
    "maxSpeed": 900,
    "captureRate": 1
  },
  "Orserk": {
    "id": 106,
    "mainType": "Dragon",
    "subType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 4,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 7,
    "rank": 140,
    "HP": 100,
    "melee": 100,
    "shot": 130,
    "defense": 100,
    "price": 8320,
    "walkSpeed": 185,
    "runSpeed": 900,
    "maxSpeed": 1200,
    "transportSpeed": 250,
    "captureRate": 1
  },
  "Astegon": {
    "id": 98,
    "mainType": "Dragon",
    "subType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 4,
    "Oil": 3,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 9,
    "rank": 150,
    "HP": 100,
    "melee": 100,
    "shot": 125,
    "defense": 125,
    "price": 8200,
    "walkSpeed": 150,
    "runSpeed": 600,
    "maxSpeed": 800,
    "captureRate": 1
  },
  "Helzephyr": {
    "id": 97,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 8,
    "rank": 190,
    "HP": 100,
    "melee": 100,
    "shot": 125,
    "defense": 100,
    "price": 7840,
    "walkSpeed": 100,
    "runSpeed": 700,
    "maxSpeed": 900,
    "transportSpeed": 450,
    "captureRate": 1
  },
  "Grizzbolt": {
    "id": 103,
    "mainType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 3,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 7,
    "rank": 200,
    "HP": 105,
    "melee": 120,
    "shot": 100,
    "defense": 100,
    "price": 7720,
    "walkSpeed": 140,
    "runSpeed": 470,
    "maxSpeed": 550,
    "transportSpeed": 210,
    "captureRate": 1
  },
  "Lyleen Noct": {
    "id": 104,
    "variant": true,
    "mainType": "Dark",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 3,
    "gathering": 2,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 3,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 6,
    "rank": 210,
    "HP": 110,
    "melee": 100,
    "shot": 110,
    "defense": 115,
    "price": 7610,
    "walkSpeed": 100,
    "runSpeed": 450,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Beakon": {
    "id": 73,
    "mainType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 2,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 7,
    "rank": 220,
    "HP": 105,
    "melee": 100,
    "shot": 115,
    "defense": 80,
    "price": 7490,
    "walkSpeed": 200,
    "runSpeed": 750,
    "maxSpeed": 950,
    "transportSpeed": 375,
    "captureRate": 1
  },
  "Ice Reptyro": {
    "id": 88,
    "variant": true,
    "mainType": "Ice",
    "subType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 3,
    "Oil": 0,
    "medicine": 0,
    "cooling": 3,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 230,
    "HP": 110,
    "melee": 100,
    "shot": 105,
    "defense": 130,
    "price": 7380,
    "walkSpeed": 80,
    "runSpeed": 390,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Pyrin Noct": {
    "id": 58,
    "variant": true,
    "mainType": "Fire",
    "subType": "Dark",
    "nocturnal": true,
    "kindling": 2,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 240,
    "HP": 100,
    "melee": 110,
    "shot": 95,
    "defense": 90,
    "price": 7270,
    "walkSpeed": 150,
    "runSpeed": 850,
    "maxSpeed": 1100,
    "captureRate": 1
  },
  "Lyleen": {
    "id": 104,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 4,
    "generating": 0,
    "handiwork": 3,
    "gathering": 2,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 3,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 6,
    "rank": 250,
    "HP": 110,
    "melee": 100,
    "shot": 110,
    "defense": 105,
    "price": 7160,
    "walkSpeed": 100,
    "runSpeed": 450,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Menasting": {
    "id": 99,
    "mainType": "Dark",
    "subType": "Earth",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 3,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 260,
    "HP": 100,
    "melee": 100,
    "shot": 100,
    "defense": 130,
    "price": 7050,
    "walkSpeed": 200,
    "runSpeed": 1000,
    "maxSpeed": 1200,
    "captureRate": 1
  },
  "Relaxaurus Lux": {
    "id": 85,
    "variant": true,
    "mainType": "Dragon",
    "subType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 3,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 7,
    "rank": 270,
    "HP": 110,
    "melee": 110,
    "shot": 110,
    "defense": 75,
    "price": 10380,
    "walkSpeed": 60,
    "runSpeed": 650,
    "maxSpeed": 800,
    "transportSpeed": 150,
    "captureRate": 1
  },
  "Relaxaurus": {
    "id": 85,
    "mainType": "Dragon",
    "subType": "Water",
    "kindling": 0,
    "watering": 2,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 7,
    "rank": 280,
    "HP": 110,
    "melee": 110,
    "shot": 100,
    "defense": 70,
    "price": 10240,
    "walkSpeed": 60,
    "runSpeed": 650,
    "maxSpeed": 800,
    "transportSpeed": 150,
    "captureRate": 1
  },
  "Mammorest Cryst": {
    "id": 90,
    "variant": true,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 2,
    "Oil": 0,
    "medicine": 0,
    "cooling": 2,
    "transporting": 0,
    "farming": 0,
    "satiety": 8,
    "rank": 290,
    "HP": 150,
    "melee": 100,
    "shot": 85,
    "defense": 90,
    "price": 9580,
    "walkSpeed": 135,
    "runSpeed": 430,
    "maxSpeed": 600,
    "captureRate": 1
  },
  "Mammorest": {
    "id": 90,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 2,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 2,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 8,
    "rank": 300,
    "HP": 150,
    "melee": 100,
    "shot": 85,
    "defense": 90,
    "price": 9450,
    "walkSpeed": 135,
    "runSpeed": 430,
    "maxSpeed": 600,
    "captureRate": 1
  },
  "Jormuntide": {
    "id": 101,
    "mainType": "Dragon",
    "subType": "Water",
    "kindling": 0,
    "watering": 4,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 310,
    "HP": 130,
    "melee": 150,
    "shot": 120,
    "defense": 100,
    "price": 9320,
    "walkSpeed": 175,
    "runSpeed": 525,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Jormuntide Ignis": {
    "id": 101,
    "variant": true,
    "mainType": "Dragon",
    "subType": "Fire",
    "kindling": 4,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 315,
    "HP": 130,
    "melee": 150,
    "shot": 130,
    "defense": 100,
    "price": 9500,
    "walkSpeed": 175,
    "runSpeed": 525,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Reptyro": {
    "id": 88,
    "mainType": "Fire",
    "subType": "Earth",
    "kindling": 3,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 3,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 320,
    "HP": 110,
    "melee": 100,
    "shot": 105,
    "defense": 120,
    "price": 6940,
    "walkSpeed": 80,
    "runSpeed": 390,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Elizabee": {
    "id": 51,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 2,
    "generating": 0,
    "handiwork": 2,
    "gathering": 2,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 2,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 330,
    "HP": 90,
    "melee": 100,
    "shot": 105,
    "defense": 100,
    "price": 6830,
    "walkSpeed": 250,
    "runSpeed": 450,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Warsect": {
    "id": 92,
    "mainType": "Earth",
    "subType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 1,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 3,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 6,
    "rank": 340,
    "HP": 120,
    "melee": 100,
    "shot": 100,
    "defense": 120,
    "price": 6830,
    "walkSpeed": 110,
    "runSpeed": 500,
    "maxSpeed": 600,
    "transportSpeed": 110,
    "captureRate": 1
  },
  "Quivern": {
    "id": 95,
    "mainType": "Dragon",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 2,
    "lumbering": 0,
    "mining": 2,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 4,
    "rank": 350,
    "HP": 105,
    "melee": 100,
    "shot": 100,
    "defense": 100,
    "price": 6830,
    "walkSpeed": 240,
    "runSpeed": 800,
    "maxSpeed": 950,
    "transportSpeed": 470,
    "captureRate": 1
  },
  "Pyrin": {
    "id": 58,
    "mainType": "Fire",
    "kindling": 2,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 360,
    "HP": 100,
    "melee": 110,
    "shot": 95,
    "defense": 90,
    "price": 6720,
    "walkSpeed": 150,
    "runSpeed": 850,
    "maxSpeed": 1100,
    "captureRate": 1
  },
  "Faleris": {
    "id": 105,
    "mainType": "Fire",
    "kindling": 3,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 8,
    "rank": 370,
    "HP": 100,
    "melee": 100,
    "shot": 105,
    "defense": 110,
    "price": 6720,
    "walkSpeed": 200,
    "runSpeed": 1000,
    "maxSpeed": 1200,
    "transportSpeed": 500,
    "captureRate": 1
  },
  "Ragnahawk": {
    "id": 74,
    "mainType": "Fire",
    "kindling": 3,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 7,
    "rank": 380,
    "HP": 95,
    "melee": 100,
    "shot": 105,
    "defense": 120,
    "price": 6720,
    "walkSpeed": 200,
    "runSpeed": 800,
    "maxSpeed": 1000,
    "transportSpeed": 375,
    "captureRate": 1
  },
  "Mossanda Lux": {
    "id": 33,
    "variant": true,
    "mainType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 2,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 5,
    "rank": 390,
    "HP": 100,
    "melee": 100,
    "shot": 100,
    "defense": 100,
    "price": 6610,
    "walkSpeed": 100,
    "runSpeed": 500,
    "maxSpeed": 700,
    "transportSpeed": 275,
    "captureRate": 1
  },
  "Sweepa": {
    "id": 54,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 2,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 2,
    "transporting": 0,
    "farming": 0,
    "satiety": 3,
    "rank": 410,
    "HP": 100,
    "melee": 100,
    "shot": 90,
    "defense": 90,
    "price": 6400,
    "walkSpeed": 120,
    "runSpeed": 300,
    "maxSpeed": 500,
    "captureRate": 1
  },
  "Nitewing": {
    "id": 38,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 2,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 420,
    "HP": 100,
    "melee": 100,
    "shot": 95,
    "defense": 80,
    "price": 6300,
    "walkSpeed": 150,
    "runSpeed": 600,
    "maxSpeed": 750,
    "captureRate": 1
  },
  "Mossanda": {
    "id": 33,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 2,
    "generating": 0,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 5,
    "rank": 430,
    "HP": 100,
    "melee": 100,
    "shot": 90,
    "defense": 90,
    "price": 6200,
    "walkSpeed": 100,
    "runSpeed": 500,
    "maxSpeed": 700,
    "transportSpeed": 275,
    "captureRate": 1
  },
  "Kingpaca Cryst": {
    "id": 89,
    "variant": true,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 3,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 440,
    "HP": 120,
    "melee": 100,
    "shot": 85,
    "defense": 90,
    "price": 6100,
    "walkSpeed": 80,
    "runSpeed": 500,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Sibelyx": {
    "id": 79,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 2,
    "cooling": 2,
    "transporting": 0,
    "farming": 1,
    "satiety": 5,
    "rank": 450,
    "HP": 110,
    "melee": 90,
    "shot": 90,
    "defense": 100,
    "price": 5900,
    "walkSpeed": 100,
    "runSpeed": 400,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Wumpo": {
    "id": 91,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 3,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 2,
    "transporting": 4,
    "farming": 0,
    "satiety": 8,
    "rank": 460,
    "HP": 140,
    "melee": 100,
    "shot": 80,
    "defense": 100,
    "price": 5900,
    "walkSpeed": 100,
    "runSpeed": 365,
    "maxSpeed": 550,
    "transportSpeed": 150,
    "captureRate": 1
  },
  "Kingpaca": {
    "id": 89,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 470,
    "HP": 120,
    "melee": 100,
    "shot": 85,
    "defense": 90,
    "price": 5800,
    "walkSpeed": 80,
    "runSpeed": 500,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Wumpo Botan": {
    "id": 91,
    "variant": true,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 1,
    "generating": 0,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 3,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 4,
    "farming": 0,
    "satiety": 8,
    "rank": 480,
    "HP": 140,
    "melee": 100,
    "shot": 80,
    "defense": 110,
    "price": 5700,
    "walkSpeed": 100,
    "runSpeed": 365,
    "maxSpeed": 550,
    "transportSpeed": 150,
    "captureRate": 1
  },
  "Cinnamoth": {
    "id": 41,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 2,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 1,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 3,
    "rank": 490,
    "HP": 70,
    "melee": 100,
    "shot": 80,
    "defense": 80,
    "price": 5700,
    "walkSpeed": 150,
    "runSpeed": 550,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Azurobe": {
    "id": 82,
    "mainType": "Water",
    "subType": "Dragon",
    "kindling": 0,
    "watering": 3,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 6,
    "rank": 500,
    "HP": 110,
    "melee": 70,
    "shot": 100,
    "defense": 100,
    "price": 5600,
    "walkSpeed": 150,
    "runSpeed": 600,
    "maxSpeed": 800,
    "captureRate": 1
  },
  "Grintale": {
    "id": 52,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 2,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 4,
    "rank": 510,
    "HP": 110,
    "melee": 100,
    "shot": 80,
    "defense": 80,
    "price": 5510,
    "walkSpeed": 64,
    "runSpeed": 600,
    "maxSpeed": 800,
    "captureRate": 1
  },
  "Penking": {
    "id": 11,
    "mainType": "Water",
    "subType": "Ice",
    "kindling": 0,
    "watering": 2,
    "planting": 0,
    "generating": 0,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 0,
    "mining": 2,
    "Oil": 0,
    "medicine": 0,
    "cooling": 2,
    "transporting": 2,
    "farming": 0,
    "satiety": 8,
    "rank": 520,
    "HP": 95,
    "melee": 70,
    "shot": 95,
    "defense": 95,
    "price": 5410,
    "walkSpeed": 110,
    "runSpeed": 450,
    "maxSpeed": 600,
    "transportSpeed": 280,
    "captureRate": 1
  },
  "Elphidran Aqua": {
    "id": 80,
    "variant": true,
    "mainType": "Dragon",
    "subType": "Water",
    "kindling": 0,
    "watering": 3,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 6,
    "rank": 530,
    "HP": 115,
    "melee": 80,
    "shot": 80,
    "defense": 95,
    "price": 5320,
    "walkSpeed": 83,
    "runSpeed": 630,
    "maxSpeed": 800,
    "captureRate": 1
  },
  "Elphidran": {
    "id": 80,
    "mainType": "Dragon",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 6,
    "rank": 540,
    "HP": 110,
    "melee": 80,
    "shot": 80,
    "defense": 90,
    "price": 5230,
    "walkSpeed": 83,
    "runSpeed": 630,
    "maxSpeed": 800,
    "captureRate": 1
  },
  "Surfent Terra": {
    "id": 65,
    "variant": true,
    "mainType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 550,
    "HP": 90,
    "melee": 70,
    "shot": 90,
    "defense": 100,
    "price": 5140,
    "walkSpeed": 200,
    "runSpeed": 500,
    "maxSpeed": 650,
    "captureRate": 1
  },
  "Surfent": {
    "id": 65,
    "mainType": "Water",
    "kindling": 0,
    "watering": 2,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 560,
    "HP": 90,
    "melee": 70,
    "shot": 90,
    "defense": 80,
    "price": 5050,
    "walkSpeed": 200,
    "runSpeed": 500,
    "maxSpeed": 650,
    "captureRate": 1
  },
  "Anubis": {
    "id": 100,
    "mainType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 4,
    "gathering": 0,
    "lumbering": 0,
    "mining": 3,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 6,
    "rank": 570,
    "HP": 120,
    "melee": 130,
    "shot": 130,
    "defense": 100,
    "price": 4960,
    "walkSpeed": 160,
    "runSpeed": 800,
    "maxSpeed": 1000,
    "transportSpeed": 480,
    "captureRate": 1
  },
  "Incineram Noct": {
    "id": 40,
    "variant": true,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 0,
    "mining": 1,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 4,
    "rank": 580,
    "HP": 95,
    "melee": 150,
    "shot": 105,
    "defense": 85,
    "price": 4870,
    "walkSpeed": 160,
    "runSpeed": 700,
    "maxSpeed": 960,
    "transportSpeed": 320,
    "captureRate": 1
  },
  "Incineram": {
    "id": 40,
    "mainType": "Fire",
    "subType": "Dark",
    "nocturnal": true,
    "kindling": 1,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 0,
    "mining": 1,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 4,
    "rank": 590,
    "HP": 95,
    "melee": 150,
    "shot": 100,
    "defense": 85,
    "price": 4780,
    "walkSpeed": 160,
    "runSpeed": 700,
    "maxSpeed": 960,
    "transportSpeed": 320,
    "captureRate": 1
  },
  "Vanwyrm Cryst": {
    "id": 71,
    "variant": true,
    "mainType": "Ice",
    "subType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 2,
    "transporting": 3,
    "farming": 0,
    "satiety": 6,
    "rank": 620,
    "HP": 90,
    "melee": 100,
    "shot": 120,
    "defense": 95,
    "price": 4610,
    "walkSpeed": 350,
    "runSpeed": 700,
    "maxSpeed": 850,
    "transportSpeed": 475,
    "captureRate": 1
  },
  "Bushi": {
    "id": 72,
    "mainType": "Fire",
    "kindling": 2,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 3,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 4,
    "rank": 640,
    "HP": 80,
    "melee": 100,
    "shot": 125,
    "defense": 80,
    "price": 4520,
    "walkSpeed": 160,
    "runSpeed": 600,
    "maxSpeed": 900,
    "transportSpeed": 320,
    "captureRate": 1
  },
  "Vanwyrm": {
    "id": 71,
    "mainType": "Fire",
    "subType": "Dark",
    "nocturnal": true,
    "kindling": 1,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 6,
    "rank": 660,
    "HP": 90,
    "melee": 100,
    "shot": 115,
    "defense": 90,
    "price": 4360,
    "walkSpeed": 350,
    "runSpeed": 700,
    "maxSpeed": 850,
    "transportSpeed": 475,
    "captureRate": 1
  },
  "Blazehowl Noct": {
    "id": 84,
    "variant": true,
    "mainType": "Fire",
    "subType": "Dark",
    "nocturnal": true,
    "kindling": 3,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 670,
    "HP": 105,
    "melee": 100,
    "shot": 115,
    "defense": 80,
    "price": 4360,
    "walkSpeed": 90,
    "runSpeed": 750,
    "maxSpeed": 900,
    "captureRate": 1
  },
  "Univolt": {
    "id": 56,
    "mainType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 2,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 680,
    "HP": 80,
    "melee": 110,
    "shot": 105,
    "defense": 105,
    "price": 4280,
    "walkSpeed": 130,
    "runSpeed": 720,
    "maxSpeed": 1000,
    "captureRate": 0.9
  },
  "Katress": {
    "id": 75,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 2,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 5,
    "rank": 700,
    "HP": 90,
    "melee": 100,
    "shot": 105,
    "defense": 90,
    "price": 4120,
    "walkSpeed": 145,
    "runSpeed": 440,
    "maxSpeed": 620,
    "transportSpeed": 292,
    "captureRate": 1
  },
  "Blazehowl": {
    "id": 84,
    "mainType": "Fire",
    "kindling": 3,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 710,
    "HP": 105,
    "melee": 100,
    "shot": 110,
    "defense": 80,
    "price": 4040,
    "walkSpeed": 180,
    "runSpeed": 750,
    "maxSpeed": 900,
    "captureRate": 1
  },
  "Rayhound": {
    "id": 60,
    "mainType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 2,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 740,
    "HP": 90,
    "melee": 100,
    "shot": 100,
    "defense": 80,
    "price": 3880,
    "walkSpeed": 210,
    "runSpeed": 700,
    "maxSpeed": 1050,
    "captureRate": 1
  },
  "Tombat": {
    "id": 68,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 2,
    "lumbering": 0,
    "mining": 2,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 5,
    "rank": 750,
    "HP": 95,
    "melee": 100,
    "shot": 95,
    "defense": 80,
    "price": 3810,
    "walkSpeed": 140,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 270,
    "captureRate": 1
  },
  "Foxcicle": {
    "id": 57,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 2,
    "transporting": 0,
    "farming": 0,
    "satiety": 3,
    "rank": 760,
    "HP": 90,
    "melee": 100,
    "shot": 95,
    "defense": 105,
    "price": 3730,
    "walkSpeed": 130,
    "runSpeed": 600,
    "maxSpeed": 750,
    "captureRate": 1
  },
  "Petallia": {
    "id": 87,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 3,
    "generating": 0,
    "handiwork": 2,
    "gathering": 2,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 2,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 3,
    "rank": 780,
    "HP": 100,
    "melee": 100,
    "shot": 95,
    "defense": 100,
    "price": 3590,
    "walkSpeed": 150,
    "runSpeed": 550,
    "maxSpeed": 700,
    "transportSpeed": 350,
    "captureRate": 1
  },
  "Arsox": {
    "id": 42,
    "mainType": "Fire",
    "kindling": 2,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 790,
    "HP": 85,
    "melee": 100,
    "shot": 95,
    "defense": 95,
    "price": 3520,
    "walkSpeed": 87,
    "runSpeed": 600,
    "maxSpeed": 800,
    "captureRate": 1
  },
  "Chillet": {
    "id": 55,
    "mainType": "Ice",
    "subType": "Dragon",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 1,
    "transporting": 0,
    "farming": 0,
    "satiety": 3,
    "rank": 800,
    "HP": 90,
    "melee": 100,
    "shot": 80,
    "defense": 80,
    "price": 3450,
    "walkSpeed": 180,
    "runSpeed": 600,
    "maxSpeed": 800,
    "captureRate": 1
  },
  "Dinossom Lux": {
    "id": 64,
    "variant": true,
    "mainType": "Electricity",
    "subType": "Dragon",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 2,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 6,
    "rank": 810,
    "HP": 110,
    "melee": 90,
    "shot": 90,
    "defense": 90,
    "price": 3380,
    "walkSpeed": 120,
    "runSpeed": 550,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Dinossom": {
    "id": 64,
    "mainType": "Leaf",
    "subType": "Dragon",
    "kindling": 0,
    "watering": 0,
    "planting": 2,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 3,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 6,
    "rank": 820,
    "HP": 110,
    "melee": 90,
    "shot": 85,
    "defense": 90,
    "price": 3240,
    "walkSpeed": 120,
    "runSpeed": 550,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Kitsun": {
    "id": 61,
    "mainType": "Fire",
    "kindling": 2,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 4,
    "rank": 830,
    "HP": 100,
    "melee": 70,
    "shot": 115,
    "defense": 100,
    "price": 3170,
    "walkSpeed": 130,
    "runSpeed": 700,
    "maxSpeed": 900,
    "captureRate": 1
  },
  "Broncherry Aqua": {
    "id": 86,
    "variant": true,
    "mainType": "Leaf",
    "subType": "Water",
    "kindling": 0,
    "watering": 3,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 840,
    "HP": 120,
    "melee": 80,
    "shot": 95,
    "defense": 100,
    "price": 3110,
    "walkSpeed": 75,
    "runSpeed": 350,
    "maxSpeed": 500,
    "captureRate": 1
  },
  "Digtoise": {
    "id": 67,
    "mainType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 3,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 850,
    "HP": 80,
    "melee": 80,
    "shot": 95,
    "defense": 120,
    "price": 2980,
    "walkSpeed": 120,
    "runSpeed": 300,
    "maxSpeed": 420,
    "captureRate": 1
  },
  "Broncherry": {
    "id": 86,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 3,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 860,
    "HP": 120,
    "melee": 80,
    "shot": 90,
    "defense": 100,
    "price": 2920,
    "walkSpeed": 75,
    "runSpeed": 350,
    "maxSpeed": 500,
    "captureRate": 1
  },
  "Celaray": {
    "id": 25,
    "mainType": "Water",
    "kindling": 0,
    "watering": 1,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 3,
    "rank": 870,
    "HP": 80,
    "melee": 100,
    "shot": 70,
    "defense": 80,
    "price": 2860,
    "walkSpeed": 150,
    "runSpeed": 550,
    "maxSpeed": 700,
    "transportSpeed": 350,
    "captureRate": 1.1
  },
  "Reindrix": {
    "id": 59,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 2,
    "transporting": 0,
    "farming": 0,
    "satiety": 7,
    "rank": 880,
    "HP": 100,
    "melee": 80,
    "shot": 85,
    "defense": 110,
    "price": 2800,
    "walkSpeed": 70,
    "runSpeed": 550,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Melpaca": {
    "id": 36,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 1,
    "satiety": 3,
    "rank": 890,
    "HP": 90,
    "melee": 90,
    "shot": 75,
    "defense": 90,
    "price": 2740,
    "walkSpeed": 62,
    "runSpeed": 460,
    "maxSpeed": 600,
    "captureRate": 1
  },
  "Dumud": {
    "id": 43,
    "mainType": "Earth",
    "kindling": 0,
    "watering": 1,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 2,
    "Oil": 1,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 4,
    "rank": 895,
    "HP": 100,
    "melee": 100,
    "shot": 70,
    "defense": 95,
    "price": 4690,
    "walkSpeed": 150,
    "runSpeed": 450,
    "maxSpeed": 600,
    "transportSpeed": 300,
    "captureRate": 1
  },
  "Eikthyrdeer Terra": {
    "id": 37,
    "variant": true,
    "mainType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 900,
    "HP": 95,
    "melee": 70,
    "shot": 80,
    "defense": 80,
    "price": 2680,
    "walkSpeed": 120,
    "runSpeed": 700,
    "maxSpeed": 900,
    "captureRate": 1
  },
  "Mozzarina": {
    "id": 29,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 1,
    "satiety": 3,
    "rank": 910,
    "HP": 90,
    "melee": 100,
    "shot": 50,
    "defense": 80,
    "price": 2620,
    "walkSpeed": 55,
    "runSpeed": 580,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Eikthyrdeer": {
    "id": 37,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 920,
    "HP": 95,
    "melee": 70,
    "shot": 80,
    "defense": 80,
    "price": 2620,
    "walkSpeed": 120,
    "runSpeed": 700,
    "maxSpeed": 900,
    "captureRate": 1
  },
  "Caprity": {
    "id": 35,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 2,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 1,
    "satiety": 4,
    "rank": 930,
    "HP": 100,
    "melee": 70,
    "shot": 70,
    "defense": 90,
    "price": 2510,
    "walkSpeed": 70,
    "runSpeed": 400,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Lovander": {
    "id": 69,
    "mainType": "Normal",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 0,
    "mining": 1,
    "Oil": 0,
    "medicine": 2,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 5,
    "rank": 940,
    "HP": 120,
    "melee": 70,
    "shot": 70,
    "defense": 70,
    "price": 2450,
    "walkSpeed": 170,
    "runSpeed": 750,
    "maxSpeed": 850,
    "transportSpeed": 460,
    "captureRate": 1
  },
  "Loupmoon": {
    "id": 46,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 2,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 950,
    "HP": 80,
    "melee": 130,
    "shot": 100,
    "defense": 80,
    "price": 2400,
    "walkSpeed": 150,
    "runSpeed": 600,
    "maxSpeed": 800,
    "captureRate": 1
  },
  "Fenglope": {
    "id": 93,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 6,
    "rank": 980,
    "HP": 110,
    "melee": 110,
    "shot": 110,
    "defense": 90,
    "price": 2250,
    "walkSpeed": 100,
    "runSpeed": 750,
    "maxSpeed": 950,
    "captureRate": 1
  },
  "Verdash": {
    "id": 77,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 2,
    "generating": 0,
    "handiwork": 3,
    "gathering": 3,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 3,
    "rank": 990,
    "HP": 90,
    "melee": 100,
    "shot": 115,
    "defense": 90,
    "price": 2200,
    "walkSpeed": 195,
    "runSpeed": 500,
    "maxSpeed": 700,
    "transportSpeed": 275,
    "captureRate": 1
  },
  "Robinquill Terra": {
    "id": 48,
    "variant": true,
    "mainType": "Leaf",
    "subType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 2,
    "gathering": 2,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 1,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 3,
    "rank": 1000,
    "HP": 90,
    "melee": 100,
    "shot": 105,
    "defense": 80,
    "price": 2150,
    "walkSpeed": 100,
    "runSpeed": 600,
    "maxSpeed": 750,
    "transportSpeed": 400,
    "captureRate": 1
  },
  "Felbat": {
    "id": 94,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 3,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 1010,
    "HP": 100,
    "melee": 100,
    "shot": 105,
    "defense": 110,
    "price": 2100,
    "walkSpeed": 100,
    "runSpeed": 550,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Robinquill": {
    "id": 48,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 1,
    "generating": 0,
    "handiwork": 2,
    "gathering": 2,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 1,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 3,
    "rank": 1020,
    "HP": 90,
    "melee": 100,
    "shot": 105,
    "defense": 80,
    "price": 2050,
    "walkSpeed": 100,
    "runSpeed": 600,
    "maxSpeed": 750,
    "transportSpeed": 400,
    "captureRate": 1
  },
  "Galeclaw": {
    "id": 47,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 2,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 4,
    "rank": 1030,
    "HP": 75,
    "melee": 120,
    "shot": 85,
    "defense": 60,
    "price": 2010,
    "walkSpeed": 200,
    "runSpeed": 600,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Gorirat": {
    "id": 49,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 2,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 3,
    "farming": 0,
    "satiety": 3,
    "rank": 1040,
    "HP": 90,
    "melee": 110,
    "shot": 95,
    "defense": 90,
    "price": 2010,
    "walkSpeed": 100,
    "runSpeed": 550,
    "maxSpeed": 720,
    "transportSpeed": 250,
    "captureRate": 1
  },
  "Vaelet": {
    "id": 78,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 2,
    "generating": 0,
    "handiwork": 2,
    "gathering": 2,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 3,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 3,
    "rank": 1050,
    "HP": 100,
    "melee": 100,
    "shot": 100,
    "defense": 120,
    "price": 1960,
    "walkSpeed": 150,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 275,
    "captureRate": 1
  },
  "Direhowl": {
    "id": 26,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 3,
    "rank": 1060,
    "HP": 80,
    "melee": 110,
    "shot": 90,
    "defense": 75,
    "price": 1920,
    "walkSpeed": 180,
    "runSpeed": 800,
    "maxSpeed": 950,
    "captureRate": 1
  },
  "Beegarde": {
    "id": 50,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 1,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 1,
    "cooling": 0,
    "transporting": 2,
    "farming": 1,
    "satiety": 3,
    "rank": 1070,
    "HP": 80,
    "melee": 100,
    "shot": 90,
    "defense": 90,
    "price": 1880,
    "walkSpeed": 250,
    "runSpeed": 450,
    "maxSpeed": 550,
    "transportSpeed": 350,
    "captureRate": 1
  },
  "Cawgnito": {
    "id": 44,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 5,
    "rank": 1080,
    "HP": 75,
    "melee": 80,
    "shot": 95,
    "defense": 80,
    "price": 1840,
    "walkSpeed": 170,
    "runSpeed": 920,
    "maxSpeed": 1200,
    "captureRate": 1
  },
  "Gobfin": {
    "id": 31,
    "mainType": "Water",
    "kindling": 0,
    "watering": 2,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 3,
    "rank": 1090,
    "HP": 90,
    "melee": 90,
    "shot": 90,
    "defense": 75,
    "price": 1840,
    "walkSpeed": 80,
    "runSpeed": 400,
    "maxSpeed": 500,
    "transportSpeed": 120,
    "captureRate": 1
  },
  "Gobfin Ignis": {
    "id": 31,
    "variant": true,
    "mainType": "Fire",
    "kindling": 2,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 3,
    "rank": 1100,
    "HP": 90,
    "melee": 90,
    "shot": 90,
    "defense": 75,
    "price": 1800,
    "walkSpeed": 80,
    "runSpeed": 400,
    "maxSpeed": 500,
    "transportSpeed": 120,
    "captureRate": 1
  },
  "Lunaris": {
    "id": 63,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 3,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1110,
    "HP": 90,
    "melee": 80,
    "shot": 100,
    "defense": 90,
    "price": 1760,
    "walkSpeed": 130,
    "runSpeed": 500,
    "maxSpeed": 650,
    "transportSpeed": 315,
    "captureRate": 1
  },
  "Leezpunk": {
    "id": 45,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 3,
    "rank": 1120,
    "HP": 80,
    "melee": 90,
    "shot": 80,
    "defense": 50,
    "price": 1720,
    "walkSpeed": 140,
    "runSpeed": 600,
    "maxSpeed": 800,
    "transportSpeed": 270,
    "captureRate": 1
  },
  "Rushoar": {
    "id": 20,
    "mainType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 1,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 3,
    "rank": 1130,
    "HP": 80,
    "melee": 100,
    "shot": 70,
    "defense": 70,
    "price": 1680,
    "walkSpeed": 150,
    "runSpeed": 450,
    "maxSpeed": 700,
    "captureRate": 1
  },
  "Leezpunk Ignis": {
    "id": 45,
    "variant": true,
    "mainType": "Fire",
    "kindling": 1,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 3,
    "rank": 1140,
    "HP": 80,
    "melee": 90,
    "shot": 80,
    "defense": 50,
    "price": 1640,
    "walkSpeed": 140,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 270,
    "captureRate": 1
  },
  "Maraith": {
    "id": 66,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 2,
    "lumbering": 0,
    "mining": 1,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 3,
    "rank": 1150,
    "HP": 75,
    "melee": 50,
    "shot": 105,
    "defense": 80,
    "price": 1570,
    "walkSpeed": 160,
    "runSpeed": 600,
    "maxSpeed": 800,
    "captureRate": 1
  },
  "Rooby": {
    "id": 9,
    "mainType": "Fire",
    "kindling": 1,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 3,
    "rank": 1155,
    "HP": 75,
    "melee": 100,
    "shot": 70,
    "defense": 75,
    "price": 2950,
    "walkSpeed": 100,
    "runSpeed": 400,
    "maxSpeed": 550,
    "captureRate": 1.1
  },
  "Wixen": {
    "id": 76,
    "mainType": "Fire",
    "kindling": 2,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 3,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 5,
    "rank": 1160,
    "HP": 90,
    "melee": 50,
    "shot": 110,
    "defense": 80,
    "price": 1540,
    "walkSpeed": 145,
    "runSpeed": 440,
    "maxSpeed": 620,
    "transportSpeed": 292,
    "captureRate": 1
  },
  "Nox": {
    "id": 21,
    "mainType": "Dark",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 2,
    "rank": 1180,
    "HP": 75,
    "melee": 70,
    "shot": 85,
    "defense": 70,
    "price": 1480,
    "walkSpeed": 60,
    "runSpeed": 300,
    "maxSpeed": 500,
    "captureRate": 1
  },
  "Woolipop": {
    "id": 34,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 1,
    "satiety": 2,
    "rank": 1190,
    "HP": 70,
    "melee": 70,
    "shot": 70,
    "defense": 90,
    "price": 1450,
    "walkSpeed": 100,
    "runSpeed": 300,
    "maxSpeed": 400,
    "captureRate": 1
  },
  "Dazzi": {
    "id": 62,
    "mainType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 1,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1210,
    "HP": 70,
    "melee": 110,
    "shot": 80,
    "defense": 70,
    "price": 1390,
    "walkSpeed": 200,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 300,
    "captureRate": 1
  },
  "Fuddler": {
    "id": 22,
    "mainType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 1,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1220,
    "HP": 65,
    "melee": 100,
    "shot": 80,
    "defense": 50,
    "price": 1360,
    "walkSpeed": 60,
    "runSpeed": 300,
    "maxSpeed": 550,
    "transportSpeed": 240,
    "captureRate": 1
  },
  "Daedream": {
    "id": 19,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 3,
    "rank": 1230,
    "HP": 70,
    "melee": 100,
    "shot": 75,
    "defense": 60,
    "price": 1330,
    "walkSpeed": 140,
    "runSpeed": 300,
    "maxSpeed": 550,
    "transportSpeed": 220,
    "captureRate": 1
  },
  "Gumoss": {
    "id": 13,
    "mainType": "Leaf",
    "subType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 1,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 1,
    "rank": 1240,
    "HP": 70,
    "melee": 100,
    "shot": 70,
    "defense": 70,
    "price": 1310,
    "walkSpeed": 50,
    "runSpeed": 300,
    "maxSpeed": 400,
    "captureRate": 1.3
  },
  "Tanzee": {
    "id": 8,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 1,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1250,
    "HP": 80,
    "melee": 100,
    "shot": 70,
    "defense": 70,
    "price": 1280,
    "walkSpeed": 48,
    "runSpeed": 300,
    "maxSpeed": 400,
    "transportSpeed": 174,
    "captureRate": 1.1
  },
  "Kelpsea": {
    "id": 81,
    "mainType": "Water",
    "kindling": 0,
    "watering": 1,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 1,
    "rank": 1260,
    "HP": 70,
    "melee": 100,
    "shot": 70,
    "defense": 70,
    "price": 1260,
    "walkSpeed": 100,
    "runSpeed": 700,
    "maxSpeed": 900,
    "captureRate": 1
  },
  "Kelpsea Ignis": {
    "id": 81,
    "variant": true,
    "mainType": "Fire",
    "kindling": 1,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 1,
    "rank": 1270,
    "HP": 70,
    "melee": 100,
    "shot": 70,
    "defense": 70,
    "price": 1240,
    "walkSpeed": 100,
    "runSpeed": 700,
    "maxSpeed": 900,
    "captureRate": 1
  },
  "Flopie": {
    "id": 28,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 1,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 1,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 3,
    "rank": 1280,
    "HP": 75,
    "melee": 100,
    "shot": 65,
    "defense": 70,
    "price": 1220,
    "walkSpeed": 100,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 250,
    "captureRate": 1
  },
  "Killamari": {
    "id": 23,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 3,
    "rank": 1290,
    "HP": 60,
    "melee": 100,
    "shot": 60,
    "defense": 70,
    "price": 1200,
    "walkSpeed": 120,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 260,
    "captureRate": 1
  },
  "Swee": {
    "id": 53,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 1,
    "transporting": 0,
    "farming": 0,
    "satiety": 2,
    "rank": 1300,
    "HP": 60,
    "melee": 100,
    "shot": 60,
    "defense": 60,
    "price": 1180,
    "walkSpeed": 100,
    "runSpeed": 250,
    "maxSpeed": 400,
    "captureRate": 1.1
  },
  "Ribbunny": {
    "id": 39,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1310,
    "HP": 75,
    "melee": 100,
    "shot": 65,
    "defense": 70,
    "price": 1160,
    "walkSpeed": 100,
    "runSpeed": 245,
    "maxSpeed": 350,
    "transportSpeed": 172,
    "captureRate": 1
  },
  "Bristla": {
    "id": 30,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 1,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 2,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 5,
    "rank": 1320,
    "HP": 80,
    "melee": 80,
    "shot": 80,
    "defense": 80,
    "price": 1140,
    "walkSpeed": 100,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 250,
    "captureRate": 1
  },
  "Fuack": {
    "id": 6,
    "mainType": "Water",
    "kindling": 0,
    "watering": 1,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1330,
    "HP": 60,
    "melee": 80,
    "shot": 80,
    "defense": 60,
    "price": 1120,
    "walkSpeed": 105,
    "runSpeed": 300,
    "maxSpeed": 400,
    "transportSpeed": 202,
    "captureRate": 1.1
  },
  "Tocotoco": {
    "id": 27,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 2,
    "rank": 1340,
    "HP": 60,
    "melee": 80,
    "shot": 75,
    "defense": 70,
    "price": 1090,
    "walkSpeed": 60,
    "runSpeed": 300,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Pengullet": {
    "id": 10,
    "mainType": "Water",
    "subType": "Ice",
    "kindling": 0,
    "watering": 1,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 1,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1350,
    "HP": 70,
    "melee": 70,
    "shot": 75,
    "defense": 70,
    "price": 1080,
    "walkSpeed": 60,
    "runSpeed": 500,
    "maxSpeed": 650,
    "transportSpeed": 265,
    "captureRate": 0.9
  },
  "Jolthog Cryst": {
    "id": 12,
    "variant": true,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 1,
    "transporting": 0,
    "farming": 0,
    "satiety": 2,
    "rank": 1360,
    "HP": 70,
    "melee": 70,
    "shot": 75,
    "defense": 80,
    "price": 1070,
    "walkSpeed": 60,
    "runSpeed": 400,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Jolthog": {
    "id": 12,
    "mainType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 1,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 2,
    "rank": 1370,
    "HP": 70,
    "melee": 70,
    "shot": 75,
    "defense": 70,
    "price": 1060,
    "walkSpeed": 60,
    "runSpeed": 400,
    "maxSpeed": 550,
    "captureRate": 1.2
  },
  "Depresso": {
    "id": 17,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 1,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1380,
    "HP": 70,
    "melee": 70,
    "shot": 70,
    "defense": 70,
    "price": 1050,
    "walkSpeed": 10,
    "runSpeed": 300,
    "maxSpeed": 400,
    "transportSpeed": 100,
    "captureRate": 1
  },
  "Hoocrates": {
    "id": 15,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 3,
    "rank": 1390,
    "HP": 70,
    "melee": 70,
    "shot": 70,
    "defense": 80,
    "price": 1050,
    "walkSpeed": 70,
    "runSpeed": 380,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Foxparks": {
    "id": 5,
    "mainType": "Fire",
    "kindling": 1,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 2,
    "rank": 1400,
    "HP": 65,
    "melee": 70,
    "shot": 75,
    "defense": 70,
    "price": 1040,
    "walkSpeed": 80,
    "runSpeed": 400,
    "maxSpeed": 550,
    "captureRate": 1.1
  },
  "Flambelle": {
    "id": 70,
    "mainType": "Fire",
    "kindling": 1,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 1,
    "satiety": 2,
    "rank": 1405,
    "HP": 60,
    "melee": 100,
    "shot": 70,
    "defense": 80,
    "price": 2500,
    "walkSpeed": 98,
    "runSpeed": 250,
    "maxSpeed": 375,
    "transportSpeed": 140,
    "captureRate": 1.1
  },
  "Sparkit": {
    "id": 7,
    "mainType": "Electricity",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 1,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1410,
    "HP": 60,
    "melee": 60,
    "shot": 75,
    "defense": 70,
    "price": 1030,
    "walkSpeed": 80,
    "runSpeed": 350,
    "maxSpeed": 500,
    "transportSpeed": 270,
    "captureRate": 1.1
  },
  "Hangyu": {
    "id": 32,
    "mainType": "Earth",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 2,
    "farming": 0,
    "satiety": 2,
    "rank": 1420,
    "HP": 80,
    "melee": 70,
    "shot": 70,
    "defense": 70,
    "price": 1020,
    "walkSpeed": 100,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 250,
    "captureRate": 1
  },
  "Hangyu Cryst": {
    "id": 32,
    "variant": true,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 1,
    "transporting": 2,
    "farming": 0,
    "satiety": 2,
    "rank": 1422,
    "HP": 80,
    "melee": 70,
    "shot": 80,
    "defense": 70,
    "price": 1020,
    "walkSpeed": 100,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 250,
    "captureRate": 1
  },
  "Lifmunk": {
    "id": 4,
    "mainType": "Leaf",
    "kindling": 0,
    "watering": 0,
    "planting": 1,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 1,
    "mining": 0,
    "Oil": 0,
    "medicine": 1,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 1,
    "rank": 1430,
    "HP": 75,
    "melee": 70,
    "shot": 70,
    "defense": 70,
    "price": 1010,
    "walkSpeed": 40,
    "runSpeed": 400,
    "maxSpeed": 550,
    "captureRate": 0.9
  },
  "Mau Cryst": {
    "id": 24,
    "variant": true,
    "mainType": "Ice",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 1,
    "transporting": 0,
    "farming": 1,
    "satiety": 1,
    "rank": 1440,
    "HP": 70,
    "melee": 70,
    "shot": 65,
    "defense": 70,
    "price": 1010,
    "walkSpeed": 105,
    "runSpeed": 475,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Vixy": {
    "id": 14,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 1,
    "satiety": 1,
    "rank": 1450,
    "HP": 70,
    "melee": 70,
    "shot": 70,
    "defense": 70,
    "price": 1000,
    "walkSpeed": 60,
    "runSpeed": 350,
    "maxSpeed": 450,
    "captureRate": 1.3
  },
  "Cremis": {
    "id": 18,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 1,
    "satiety": 2,
    "rank": 1455,
    "HP": 70,
    "melee": 100,
    "shot": 70,
    "defense": 75,
    "price": 1420,
    "walkSpeed": 40,
    "runSpeed": 300,
    "maxSpeed": 450,
    "captureRate": 1.3
  },
  "Cattiva": {
    "id": 2,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 1,
    "lumbering": 0,
    "mining": 1,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 0,
    "satiety": 2,
    "rank": 1460,
    "HP": 70,
    "melee": 70,
    "shot": 70,
    "defense": 70,
    "price": 1000,
    "walkSpeed": 60,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 160,
    "captureRate": 1.5
  },
  "Lamball": {
    "id": 1,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 1,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 1,
    "farming": 1,
    "satiety": 2,
    "rank": 1470,
    "HP": 70,
    "melee": 70,
    "shot": 70,
    "defense": 70,
    "price": 1000,
    "walkSpeed": 40,
    "runSpeed": 400,
    "maxSpeed": 550,
    "transportSpeed": 160,
    "captureRate": 1.5
  },
  "Mau": {
    "id": 24,
    "mainType": "Dark",
    "nocturnal": true,
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 1,
    "satiety": 1,
    "rank": 1480,
    "HP": 70,
    "melee": 70,
    "shot": 60,
    "defense": 70,
    "price": 1000,
    "walkSpeed": 105,
    "runSpeed": 475,
    "maxSpeed": 550,
    "captureRate": 1
  },
  "Teafant": {
    "id": 16,
    "mainType": "Water",
    "kindling": 0,
    "watering": 1,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 0,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 0,
    "satiety": 2,
    "rank": 1490,
    "HP": 70,
    "melee": 70,
    "shot": 60,
    "defense": 70,
    "price": 1000,
    "walkSpeed": 60,
    "runSpeed": 300,
    "maxSpeed": 400,
    "captureRate": 1.3
  },
  "Chikipi": {
    "id": 3,
    "mainType": "Normal",
    "kindling": 0,
    "watering": 0,
    "planting": 0,
    "generating": 0,
    "handiwork": 0,
    "gathering": 1,
    "lumbering": 0,
    "mining": 0,
    "Oil": 0,
    "medicine": 0,
    "cooling": 0,
    "transporting": 0,
    "farming": 1,
    "satiety": 1,
    "rank": 1500,
    "HP": 60,
    "melee": 70,
    "shot": 60,
    "defense": 60,
    "price": 1000,
    "walkSpeed": 50,
    "runSpeed": 375,
    "maxSpeed": 550,
    "captureRate": 1.5
  }
});

/***/ }),

/***/ "./src/passive.js":
/*!************************!*\
  !*** ./src/passive.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Passive)
/* harmony export */ });
/* harmony import */ var _dictionary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dictionary */ "./src/dictionary.js");


class Passive {
    /**
     * @param {HTMLDivElement} elem 
     */
    constructor(elem) {
        this.elem = elem;
        this.nameElem = this.elem.querySelector(".name");
        this.symbolElem = this.elem.querySelector("#symbol");
    }

    setPassive(passive) {
        this.elem.classList.remove("passive-good", "passive-bad", "t1", "t2", "t3");
        this.symbolElem.textContent = "";
        this.nameElem.textContent = "";

        if (passive === null)
            return;

        const { name, good, tier } = passive;

        this.elem.classList.add(good ? "passive-good" : "passive-bad", `t${tier}`);
        this.nameElem.textContent = name;

        if (tier === 3)
            this.symbolElem.textContent = "stat_3";
        else if (tier === 2)
            this.symbolElem.textContent = "stat_2";
        else
            this.symbolElem.textContent = "stat_1";
    }
}

/***/ }),

/***/ "./src/progressbar.js":
/*!****************************!*\
  !*** ./src/progressbar.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProgressBar)
/* harmony export */ });
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loader */ "./src/loader.js");


class ProgressBar {
    constructor(id, hasText = false) {
        this.elem = null;
        this.progress = null;
        this.width = 0;
        this.curValue = 0;
        this.maxValue = 0;
        this.hasText = hasText;

        this.currentElem = null;
        this.maxElem = null;

        this.load = (0,_loader__WEBPACK_IMPORTED_MODULE_0__.onPageLoaded)(() => {
            this.elem = document.querySelector(`div#${id}.progressbar`);
            if (!this.elem)
                throw new Error("Progress bar with id " + id + " does not exist.");

            this.progress = this.elem.querySelector("div.inner");
            if (!this.progress)
                throw new Error("Couldn't find the inner progressbar element.");

            if (!this.hasText)
                return;

            this.currentElem = this.elem.querySelector(".current");
            if (!this.currentElem)
                throw new Error("Couldn't find \"current\" text element in progress bar");

            this.maxElem = this.elem.querySelector(".max");
            if (!this.maxElem)
                throw new Error("Couldn't find \"max\" text element in progress bar");
        });
    }

    /**
     * Sets the value of the progressbar
     * @param {number} val;
     */
    set value(val) {
        this.width = val;

        let strval = (val * 100).toString() + "%";
        this.load.then(() => this.progress.style.width = strval);
    }

    get value() {
        return this.width;
    }

    get current() {
        return this.curValue;
    }

    get max() {
        return this.maxValue;
    }

    /**
     * Sets the display of the current value
     * @param {number} value 
     */
    set current(value) {
        this.curValue = value;
        this.value = this.current / this.max;

        if (!this.hasText)
            return;
        
        let strval = value.toFixed(0);
        this.load.then(() => this.currentElem.textContent = strval);
    }

    /**
     * Sets the text display of the max value
     * @param {number} value
     */
    set max(value) {
        this.maxValue = value;
        this.value = this.current / this.max;

        if (!this.hasText)
            return;

        let strval = value.toFixed(0);
        this.load.then(() => this.maxElem.textContent = strval);
    }
}

/***/ }),

/***/ "./src/tabcontrol.js":
/*!***************************!*\
  !*** ./src/tabcontrol.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loader */ "./src/loader.js");

let ontabchanged;

(0,_loader__WEBPACK_IMPORTED_MODULE_0__.onPageLoaded)(async () => {
    const pages = document.querySelectorAll("div.tabbed-content");
    const tabs = document.querySelector("div.tabs");

    // show the first page
    pages[0].classList.add("active");

    for (let i = 0; i < tabs.children.length; i++) {
        let tab = tabs.children[i];
        tab.addEventListener("click", () => {
            pages.forEach((page) => page.classList.remove("active"));
            tabs.children.forEach((tab) => tab.classList.remove("active"));

            pages[i].classList.add("active");
            tab.classList.add("active");

            if (ontabchanged) {
                ontabchanged(tab, pages[i]);
            }
        });
    }
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    /**
     * @param {(tab: HTMLButtonElement, page: HTMLDivElement)} value Callback for when tab changes
     */
    set onTabChanged(value) {
        ontabchanged = value;
    },
});

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ (() => {

HTMLCollection.prototype.forEach = function(fn) {
    for (let i = 0; i < this.length; i++) {
        let item = this.item(i);
        if (item !== null)
            fn(item);
    }
}

/***/ }),

/***/ "./src/viewer.js":
/*!***********************!*\
  !*** ./src/viewer.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _progressbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./progressbar */ "./src/progressbar.js");
/* harmony import */ var _passive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./passive */ "./src/passive.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loader */ "./src/loader.js");
/* harmony import */ var _dictionary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dictionary */ "./src/dictionary.js");
/* harmony import */ var _palstats__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./palstats */ "./src/palstats.js");
/* harmony import */ var _pal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pal */ "./src/pal.js");







/**
 * @type {(pal: Pal)} callback for setting pal
 */
let onPalSelected;

const load = (0,_loader__WEBPACK_IMPORTED_MODULE_2__.onPageLoaded)(() => {
    const palviewer = document.querySelector("div.palviewer");
    const listingInfo = palviewer.querySelector(".listing-info");
    const statsInfo = palviewer.querySelector(".stats-info");
    const suitability = palviewer.querySelector(".suitability");
    const passiveList = palviewer.querySelector(".passives");
    
    const levelElem = listingInfo.querySelector(".level");

    const exp = new _progressbar__WEBPACK_IMPORTED_MODULE_0__["default"]("exp");
    const expLeft = listingInfo.querySelector(".exp #left");

    const name = listingInfo.querySelector(".name");
    const gender = listingInfo.querySelector("#gender");
    const element = listingInfo.querySelector(".element");
    const subelement = listingInfo.querySelector(".subelement");

    const portrait = statsInfo.querySelector("#portrait");
    const stars = statsInfo.querySelector(".condenser").querySelectorAll(".dark");
    const rank = statsInfo.querySelector(".rank");

    const health = new _progressbar__WEBPACK_IMPORTED_MODULE_0__["default"]("health", true);
    const satiety = new _progressbar__WEBPACK_IMPORTED_MODULE_0__["default"]("satiety", true);
    const sanity = statsInfo.querySelector("span#sanity");
    const attack = statsInfo.querySelector("span#attack");
    const defense = statsInfo.querySelector("span#defense");
    const workSpeed = statsInfo.querySelector("span#workspeed");

    const kindling = suitability.querySelector("span.kindling");
    const watering = suitability.querySelector("span.watering");
    const planting = suitability.querySelector("span.planting");
    const electric = suitability.querySelector("span.electric");
    const handiwork = suitability.querySelector("span.handiwork");
    const gathering = suitability.querySelector("span.gathering");
    const logging = suitability.querySelector("span.logging");
    const mining = suitability.querySelector("span.mining");
    const medicine = suitability.querySelector("span.medicine");
    const cooling = suitability.querySelector("span.cooling");
    const transport = suitability.querySelector("span.transport");
    const farming = suitability.querySelector("span.farming");

    const passives = [];
    passiveList.querySelectorAll(".passive").forEach(passive => {
        passives.push(new _passive__WEBPACK_IMPORTED_MODULE_1__["default"](passive));
    });

    console.log(passives);

    onPalSelected = (pal) => {
        name.textContent = pal.name;
        gender.textContent = pal.gender;
        element.src = `images/element/${pal.type}.webp`;
        if (pal.sub) {
            subelement.src = `images/element/${pal.sub}.webp`;
            subelement.style.display = "block";
        } else {
            subelement.style.display = "none";
        }

        portrait.src = `images/pals/${pal.id}${pal.variant ? "b" : ""}.webp`;
        rank.textContent = `+${pal.rankTotal}`;
        for (let i = 0; i < 4; i++) {
            if (pal.rank - 1 > i) {
                stars[i].classList.remove("dark");
            } else {
                stars[i].classList.add("dark");
            }
        }

        levelElem.textContent = pal.level.toString();
        expLeft.textContent = pal.remainingExp.toFixed(0);
        exp.current = pal.exp;
        exp.max = pal.exp + pal.remainingExp;

        // Stats Info...
        health.current = pal.health;
        health.max = pal.maxHealth;
        satiety.current = pal.satiety;
        satiety.max = pal.maxSatiety;
        sanity.textContent = pal.sanity;

        // TODO: Figure out how these equate to ingame numbers
        attack.textContent = pal.attack;
        defense.textContent = pal.defense;
        workSpeed.textContent = pal.workSpeed; // TODO: Implement the passives

        // Suitability Info...
        // We use the suits from the savedata because it will have increased
        // if the pal has been upgraded all the way
        const suits = pal.suitabilities;
        kindling.textContent  = suits.kindling > 0 ? suits.kindling : "";
        watering.textContent  = suits.watering > 0 ? suits.watering : "";
        planting.textContent  = suits.planting > 0 ? suits.planting : "";
        electric.textContent  = suits.electric > 0 ? suits.electric : "";
        handiwork.textContent = suits.handiwork > 0 ? suits.handiwork : "";
        gathering.textContent = suits.gathering > 0 ? suits.gathering : "";
        logging.textContent   = suits.logging > 0 ? suits.logging : "";
        mining.textContent    = suits.mining > 0 ? suits.mining : "";
        medicine.textContent  = suits.medicine > 0 ? suits.medicine : "";
        cooling.textContent   = suits.cooling > 0 ? suits.cooling : "";
        transport.textContent = suits.transport > 0 ? suits.transport : "";
        farming.textContent   = suits.farming > 0 ? suits.farming : "";

        passives.forEach((passive, i) => {
            if (pal.passives[i]) {
                passive.setPassive(pal.passives[i]);
            } else {
                passive.setPassive(null);
            }
        });
    };
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({

    /**
     * @param {Pal} pal
     */
    set selectedPal(pal) {
        load.then(() => onPalSelected?.call(null, pal));
    }
});

/***/ }),

/***/ "./styles/index.scss":
/*!***************************!*\
  !*** ./styles/index.scss ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "3d9f4ca17a27aadb9ca1.scss";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".index.bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! index.scss */ "./styles/index.scss");
/* harmony import */ var pako__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pako */ "./node_modules/pako/dist/pako.esm.mjs");
/* harmony import */ var _viewer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./viewer */ "./src/viewer.js");
/* harmony import */ var _deferred__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./deferred */ "./src/deferred.js");
/* harmony import */ var _mostoptimal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mostoptimal */ "./src/mostoptimal.js");
/* harmony import */ var _breedpath__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./breedpath */ "./src/breedpath.js");
/* harmony import */ var _palstats__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./palstats */ "./src/palstats.js");
/* harmony import */ var _pal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pal */ "./src/pal.js");
/* harmony import */ var _inventory__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./inventory */ "./src/inventory.js");
/* harmony import */ var _dictionary__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dictionary */ "./src/dictionary.js");
/* harmony import */ var json_with_bigint__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! json-with-bigint */ "./node_modules/json-with-bigint/json-with-bigint.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./loader */ "./src/loader.js");
/* harmony import */ var _breeding__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./breeding */ "./src/breeding.js");
/* harmony import */ var _dragdrop__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./dragdrop */ "./src/dragdrop.js");
/* harmony import */ var _tabcontrol__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./tabcontrol */ "./src/tabcontrol.js");
/* harmony import */ var _progressbar__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./progressbar */ "./src/progressbar.js");

















const pals = [];
let maxProgress = 0;
let savedata;
let saveMessage, saveError;

const VALID_SAVE_MAGIC = 0x506C5A00; // "PlZ"

function downloadFromUrl(filename, url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click(); // does work!
}

function getFileHeader(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const view = new DataView(fileReader.result);
            const uncompressedSize = view.getUint32(0, true); // The size after the first inflation
            const compressedSize = view.getUint32(4, true); // The size after the second inflation
            const magic = view.getUint32(8) & 0xFFFFFF00;
            const compressionByte = view.getUint8(11);

            if (magic !== VALID_SAVE_MAGIC) {
                reject("Invalid File");
                return;
            }

            if (compressionByte !== 0x31 && compressionByte !== 0x32) {
                reject("Invalid Compression");
                return;
            }
            
            resolve([ compressedSize, uncompressedSize, compressionByte ]);
        };

        fileReader.readAsArrayBuffer(file.slice(0, 12));
    });
}

function extractPals(progressBar, data, wasBackup = false) {
    const {
        worldSaveData: {
            CharacterSaveParameterMap: {
                Values
            }
        }
    } = data;

    const url = URL.createObjectURL(new Blob([
        (0,json_with_bigint__WEBPACK_IMPORTED_MODULE_11__.JSONStringify)({ worldSaveData: { CharacterSaveParameterMap: { Values } } })
    ]));

    if (!wasBackup)
        downloadFromUrl("Level.sav.json", url);

    // for debugging....    
    // downloadFromUrl("first.bin", URL.createObjectURL(new Blob([ new Uint8Array(Values[0].Value.RawData) ])));

    const pals = [];
    for (let i = 0; i < Values.length; i++) {
        const { Key, Value: { RawData } } = Values[i];

        const palData = new Uint8Array(RawData);
        console.log("Deserializing Pal " + i);
        const pal = palparser.palFromRaw(palData, new Map(), (progress) => {
            progressBar.value = Number(progress) / RawData.length;
        });

        pals.push(pal);
    }

    localStorage.setItem("pals", (0,json_with_bigint__WEBPACK_IMPORTED_MODULE_11__.JSONStringify)(pals));
}

function readJsonBackup(file) {
    // load json backup
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
        try {
            const result = (0,json_with_bigint__WEBPACK_IMPORTED_MODULE_11__.JSONParse)(fileReader.result);
            SaveLoader.onmessage({ data: { result, wasBackup: true } });
        } catch (e) {
            console.error(e);
            _dragdrop__WEBPACK_IMPORTED_MODULE_14__["default"].error(e);
        }
    }
    
    fileReader.readAsText(file, "utf-8");
}

(0,_loader__WEBPACK_IMPORTED_MODULE_12__.onPageLoaded)(async () => {
    const palSelect = document.querySelectorAll("select.pals");
    const traitSelect = document.querySelectorAll("select.traits");
    const progressBar = new _progressbar__WEBPACK_IMPORTED_MODULE_16__["default"]("loading");

    savedata = localStorage.getItem("pals");
    if (savedata !== null) {
        savedata = JSON.parse(savedata);

        for (let i = 1; i < savedata.length; i++) {

            let props = Object.keys(savedata[i]);
            for (let x = 0; x < props.length; x++) {
                if (props[x] === "Rank") {
                    console.log(savedata[i]);
                    break;
                }
            }

            // Skip the ones that aren't in the list
            if (!_dictionary__WEBPACK_IMPORTED_MODULE_10__.PalNames.lookup(savedata[i].CharacterID))
                continue;

            const pal = new _pal__WEBPACK_IMPORTED_MODULE_8__["default"](savedata[i]);
            pals.push(pal);
            _inventory__WEBPACK_IMPORTED_MODULE_9__["default"].addItem(pal);
        }

        _inventory__WEBPACK_IMPORTED_MODULE_9__["default"].setSelected(0);

        const sort = document.querySelector("a.sort");
        sort.addEventListener("click", (e) => {
            e.preventDefault();

            const handiworkPals = pals.filter((pal) => pal.suitabilities.handiwork > 4);
            console.log(handiworkPals);
        })
    }

    saveError = console.error;
    saveMessage = (e) => {
        if (e.data.result) {
            if (!e.data.result.worldSaveData) {
                _dragdrop__WEBPACK_IMPORTED_MODULE_14__["default"].error("Loaded file does not contain element \"worldSaveData.\"");
                return;
            }

            extractPals(progressBar, e.data.result, e.data.wasBackup);
            setTimeout(() => progressBar.value = 0, 2000);
            return;
        }

        const progress = e.data;
        progressBar.value = progress / maxProgress;
    }

    _dragdrop__WEBPACK_IMPORTED_MODULE_14__["default"].onDrop = async (e) => {
        let file = e.dataTransfer.files[0];
        if (file.name.endsWith(".json")) {
            readJsonBackup(file);
            return;
        }

        try {
            const [ comp, uncomp, zbyte ] = await getFileHeader(file);
            const fileReader = new FileReader();

            function onProgress(e) {
                progressBar.value = e.loaded / e.total;
            }

            fileReader.onloadstart = onProgress;
            fileReader.onprogress = onProgress;
            fileReader.onloadend = () => {
                let rawData = pako__WEBPACK_IMPORTED_MODULE_2__["default"].inflate(fileReader.result.slice(12));

                if (zbyte === 0x32) { // inflate a second time
                    if (rawData.byteLength !== comp)
                        throw new Error(`Invalid compression length: ${rawData.byteLength}`);

                    rawData = pako__WEBPACK_IMPORTED_MODULE_2__["default"].inflate(rawData);
                }

                if (rawData.byteLength !== uncomp)
                    throw new Error(`Invalid compression length: ${rawData.byteLength}`);

                maxProgress = uncomp;
                
                const SaveLoader = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_UploadWorker_js"), __webpack_require__.b));
                window.onbeforeunload = function() {
                    SaveLoader.terminate();
                };

                SaveLoader.onmessage = saveMessage;
                SaveLoader.onerror = saveError;
                SaveLoader.postMessage(rawData);
            }

            fileReader.readAsArrayBuffer(file); // read to end

        } catch (e) {
            console.error(e);
            _dragdrop__WEBPACK_IMPORTED_MODULE_14__["default"].error(e);
        }
        
        setTimeout(() => progressBar.value = 0, 2000);
    }

    Object.keys(_palstats__WEBPACK_IMPORTED_MODULE_7__["default"]).forEach(name => {
        palSelect.forEach((elem) => {
            const opt = document.createElement("option");
            opt.value = name;
            opt.text = name;
            
            elem.appendChild(opt);
        });
    });

    Object.entries(_dictionary__WEBPACK_IMPORTED_MODULE_10__.PassiveSkills).forEach(([value, { name }])=> {
        traitSelect.forEach(elem => {
            const opt = document.createElement("option");
            opt.value = value;
            opt.text = name;
            
            elem.appendChild(opt);
        });
    })
});
})();

/******/ })()
;