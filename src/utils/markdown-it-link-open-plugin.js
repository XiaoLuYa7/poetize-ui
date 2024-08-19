const openLinksPlugin = (md) => {
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const href = token.attrGet('href');

      // 如果链接存在且不是视频链接，则设置 target="_blank"
      if (href && !href.endsWith('.mp4')) {
        token.attrSet('target', '_blank');
      }

      // 使用默认的渲染方法处理
      return self.renderToken(tokens, idx, options);
    };
  };

  export default openLinksPlugin;
