/*
 * @lc app=leetcode id=17 lang=javascript
 *
 * [17] Letter Combinations of a Phone Number
 */

// @lc code=start
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
    if(digits.length <= 0) return [];
    if(digits.length === 1 && digits[0] === 1) return [];
    const ref = {
        2: ["a", "b", "c"],
        3: ["d", "e", "f"],
        4: ["g", "h", "i"],
        5: ["j", "k", "l"],
        6: ["m", "n", "o"],
        7: ["p", "q", "r", "s"],
        8: ["t", "u", "v"],
        9: ["w", "x", "y", "z"]
    };
    let cur = ref[digits[0]], i = 1;

    while(i < digits.length) {
        let _cur = [], arr1 = cur, arr2 = ref[digits[i]];
        for(let j = 0; j < arr1.length; j++) {
            for(let k = 0; k < arr2.length; k++) {
                _cur.push(`${arr1[j]}${arr2[k]}`);
            }
        }
        cur = _cur;
        i++;
    }

    return cur;

};
// @lc code=end

// let digits = "2212";
// letterCombinations(digits);