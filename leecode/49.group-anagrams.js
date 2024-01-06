/*
 * @Author: Tina Huang
 * @Date: 2023-03-01 21:48:28
 * @LastEditors: Tina Huang
 * @LastEditTime: 2023-03-03 13:37:49
 * @Description: 
 */
/*
 * @lc app=leetcode id=49 lang=javascript
 *
 * [49] Group Anagrams
 */

// @lc code=start
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    if(strs.length <= 1)="" return="" [strs];="" let="" result="{}," _r="[]," pattern="[-1," -1,="" -1]="" const="" getstrpattern="str" ==""> {
        let arr = str.split('')
        for(let j = 0; j < arr.length; j++) {
            pattern[arr[j].charCodeAt() - 97]++;
        }
        return pattern.join('')
    }

    const clear = () => {
        for(let i = 0; i < pattern.length; i++) {
            pattern[i] = -1;
        }
    }

    for(let i = 0; i < strs.length; i++) {
        let str = getStrPattern(strs[i])

        if(result[str]) {
            result[str].push(strs[i])
        } else {
            result[str] = [strs[i]]
        }
        clear()
    }

    Object.keys(result).map(item => {
        _r.push(result[item])
    })
    console.log(_r)
    return _r
};
// @lc code=end

groupAnagrams(["eat","tea","tan","ate","nat","bat"])</=>