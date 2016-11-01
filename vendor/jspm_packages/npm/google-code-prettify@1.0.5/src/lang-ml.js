/* */ 
(function(process) {
  PR['registerLangHandler'](PR['createSimpleLexer']([[PR['PR_PLAIN'], /^[\t\n\r \xA0]+/, null, '\t\n\r \xA0'], [PR['PR_COMMENT'], /^#(?:if[\t\n\r \xA0]+(?:[a-z_$][\w\']*|``[^\r\n\t`]*(?:``|$))|else|endif|light)/i, null, '#'], [PR['PR_STRING'], /^(?:\"(?:[^\"\\]|\\[\s\S])*(?:\"|$)|\'(?:[^\'\\]|\\[\s\S])(?:\'|$))/, null, '"\'']], [[PR['PR_COMMENT'], /^(?:\/\/[^\r\n]*|\(\*[\s\S]*?\*\))/], [PR['PR_KEYWORD'], /^(?:abstract|and|as|assert|begin|class|default|delegate|do|done|downcast|downto|elif|else|end|exception|extern|false|finally|for|fun|function|if|in|inherit|inline|interface|internal|lazy|let|match|member|module|mutable|namespace|new|null|of|open|or|override|private|public|rec|return|static|struct|then|to|true|try|type|upcast|use|val|void|when|while|with|yield|asr|land|lor|lsl|lsr|lxor|mod|sig|atomic|break|checked|component|const|constraint|constructor|continue|eager|event|external|fixed|functor|global|include|method|mixin|object|parallel|process|protected|pure|sealed|trait|virtual|volatile)\b/], [PR['PR_LITERAL'], /^[+\-]?(?:0x[\da-f]+|(?:(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?))/i], [PR['PR_PLAIN'], /^(?:[a-z_][\w']*[!?#]?|``[^\r\n\t`]*(?:``|$))/i], [PR['PR_PUNCTUATION'], /^[^\t\n\r \xA0\"\'\w]+/]]), ['fs', 'ml']);
})(require('process'));
