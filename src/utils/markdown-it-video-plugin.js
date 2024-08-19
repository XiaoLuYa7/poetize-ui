const videoPlayerPlugin = (md, options) => {
    // 自定义处理链接打开标签
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const href = token.attrGet('href');

      // 检查链接是否是 .mp4 格式的视频
      if (href && href.endsWith('.mp4')) {
        const cover = options.cover ? `<img src="${options.cover}" alt="video cover">` : '';
        // 渲染视频的 HTML 结构
        return `
          <div class="video-wrapper">
            ${cover}
            <video controls>
              <source src="${href}" type="video/mp4">
            </video>
          </div>`;
      }
      // 对于其他链接，使用默认的渲染
      return self.renderToken(tokens, idx, options);
    };

    // 自定义处理链接关闭标签
    md.renderer.rules.link_close = function (tokens, idx, options, env, self) {
      const token = tokens[idx - 1];
      const href = token.attrGet('href');

      // 检查链接是否是 .mp4 格式的视频
      if (href && href.endsWith('.mp4')) {
        // 只关闭 video-wrapper 的 div
        return `</div>`;
      }
      // 对于其他链接，使用默认的渲染
      return self.renderToken(tokens, idx, options);
    };

    // 自定义处理文本节点
    md.renderer.rules.text = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const prevToken = tokens[idx - 1];

      // 检查前一个令牌是否是视频链接，并且链接是 .mp4
      if (prevToken && prevToken.type === 'link_open') {
        const href = prevToken.attrGet('href');
        if (href && href.endsWith('.mp4')) {
          // 忽略文本节点
          return '';
        }
      }

      // 对于其他文本，使用默认渲染
      return token.content;
    };
  };

  export default videoPlayerPlugin;
