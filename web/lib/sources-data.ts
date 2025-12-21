// Sources data (converted from sources.yaml for static build)
import { Source, Domain } from './types';

export const sources: Source[] = [
  // YouTube
  { id: 'karpathy', name: 'Andrej Karpathy', platform: 'youtube', channel_id: 'UCWN3xxRkmTPmbKwht9FuE5A', avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_kSJGsfhxqXj4rkRu1HQVH_XpHQL6ZP_e2kO35m1Tk2dCI=s176-c-k-c0x00ffffff-no-rj', domains: ['AI', 'Dev'] },
  { id: 'lexfridman', name: 'Lex Fridman', platform: 'youtube', channel_id: 'UCSHZKyawb77ixDdsGog4iWA', domains: ['AI', 'Business'] },
  { id: 'lennys', name: "Lenny's Podcast", platform: 'youtube', channel_id: 'UCbvaOwTvonxPn1fQ2LGEu8A', domains: ['Business', 'Growth'] },
  { id: 'a16z', name: 'a16z', platform: 'youtube', channel_id: 'UC9cn0TuPq4dnbTY-CBsm8XA', domains: ['Business', 'AI'] },
  { id: 'yc', name: 'Y Combinator', platform: 'youtube', channel_id: 'UCcefcZRL2oaA_uBNeo5UOWg', domains: ['Business', 'AI'] },
  { id: 'openai', name: 'OpenAI', platform: 'youtube', channel_id: 'UCXZCJLdBC09xxGZ6gcdrc6A', domains: ['AI'] },
  { id: 'google', name: 'Google', platform: 'youtube', channel_id: 'UCK8sQmJBp8GCxrOtXYBnZ8g', domains: ['AI', 'Tech'] },
  { id: 'guigu101_yt', name: '硅谷101', platform: 'youtube', channel_id: 'UC6qGa4HiPjC5kTYpMUE0mZw', domains: ['AI', 'Business', 'Global'] },
  { id: 'xiaodeng', name: '小邓Talk', platform: 'youtube', channel_id: 'UC_tMoGK4DLuvhaucSsLkUjA', domains: ['Business', 'Global'] },
  { id: 'xiaolin_yt', name: '小Lin说', platform: 'youtube', channel_id: 'UCwBXnYfRDqxMnrFDLdeP2-Q', domains: ['Business'] },
  { id: 'liziqi', name: '李子柒', platform: 'youtube', channel_id: 'UCoC47do520os_4DBMEFGg4A', domains: ['Creator'] },
  { id: 'laogao', name: '老高与茉莉', platform: 'youtube', channel_id: 'UCMUnInmOkrWN4gof9KlhNmQ', domains: ['Creator'] },
  
  // Bilibili
  { id: 'ysjufeng', name: '影视飓风', platform: 'bilibili', uid: '946974', domains: ['Creator', 'Design'] },
  { id: 'xiaolin_bl', name: '小Lin说', platform: 'bilibili', uid: '520155988', domains: ['Business'] },
  { id: 'youdian', name: '有点在李', platform: 'bilibili', uid: '455441770', domains: ['Business', 'Creator'] },
  { id: 'xiaoyuehan', name: '小约翰可汗', platform: 'bilibili', uid: '35359510', domains: ['Creator'] },
  { id: 'qiuzhi2046', name: '秋芝2046', platform: 'bilibili', uid: '13590573', domains: ['Business', 'Global'] },
  { id: 'shuziyoumu', name: '数字游牧人', platform: 'bilibili', uid: '401752509', domains: ['Business', 'Global'] },
  { id: 'hetongxue', name: '老师好我是何同学', platform: 'bilibili', uid: '163637592', domains: ['Tech', 'Creator'] },
  { id: 'linksphotograph', name: 'Linksphotograph', platform: 'bilibili', uid: '10756633', domains: ['Creator', 'Design'] },
  { id: 'quanxixi', name: '全嘻嘻', platform: 'bilibili', uid: '928123', domains: ['Creator'] },
  { id: 'chanpinlaozeng', name: '产品老曾', platform: 'bilibili', uid: '367877', domains: ['Business', 'Tech'] },
  { id: 'xiaoqiangge', name: '小强哥商业笔记', platform: 'bilibili', uid: '398573211', domains: ['Business'] },
  
  // X/Twitter
  { id: 'benlang', name: 'Ben Lang', platform: 'x', username: 'benln', domains: ['AI', 'Dev'] },
  { id: 'ryolu', name: 'Ryo Lu', platform: 'x', username: 'rylooo', domains: ['AI', 'Dev'] },
  { id: 'ericjing', name: 'Eric Jing', platform: 'x', username: 'ericzjing', domains: ['AI', 'Business'] },
  { id: 'zarazhang', name: 'Zara Zhang', platform: 'x', username: 'zarazhangg', domains: ['Business', 'Global'] },
  { id: 'guizang', name: '归藏', platform: 'x', username: 'op7418', domains: ['AI', 'Design'] },
  
  // Podcast
  { id: 'guigu101_pod', name: '硅谷101', platform: 'podcast', feed_url: 'https://feeds.fireside.fm/sv101/rss', domains: ['AI', 'Business', 'Global'] },
];

export function getSourceStats() {
  const total = sources.length;
  const youtube = sources.filter(s => s.platform === 'youtube').length;
  const bilibili = sources.filter(s => s.platform === 'bilibili').length;
  const x = sources.filter(s => s.platform === 'x').length;
  const podcast = sources.filter(s => s.platform === 'podcast').length;
  
  return { total, youtube, bilibili, x, podcast };
}

