'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsContent() {
  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-forest-600 hover:text-forest-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首页
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="font-display text-4xl font-bold text-forest-950 mb-8">
            服务条款
          </h1>

          <div className="prose prose-forest max-w-none">
            <p className="text-sm text-forest-600 mb-6">
              最后更新日期：2026年3月23日
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              1. 服务说明
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              PetKeeper 是一个异宠饲养管理平台，提供物种图鉴、饲养记录管理和社区交流功能。使用本服务即表示您同意遵守以下条款。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              2. 用户注册
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              注册账户时，您同意：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>提供准确、完整、最新的注册信息</li>
              <li>妥善保管账户密码，不与他人分享</li>
              <li>对账户下的所有活动负责</li>
              <li>如发现账户被盗用，立即通知我们</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              3. 用户行为规范
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              使用本服务时，您承诺不会：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>发布虚假、误导性或欺诈性内容</li>
              <li>侵犯他人的知识产权、隐私权或其他权利</li>
              <li>发布违法、有害、威胁、辱骂、骚扰或仇恨言论</li>
              <li>传播病毒、恶意代码或其他有害程序</li>
              <li>尝试未经授权访问其他用户的账户或数据</li>
              <li>干扰或破坏服务的正常运行</li>
              <li>使用自动化工具（如爬虫、机器人）抓取数据</li>
              <li>将服务用于任何非法目的</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              4. 内容政策
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              <strong>用户内容：</strong>
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>您对发布的内容（帖子、评论、图片等）拥有所有权</li>
              <li>您授予我们非独占、全球性、免费的许可，用于展示和推广您的宠物档案</li>
              <li>您保证发布的内容不侵犯任何第三方的权利</li>
              <li>您可以随时删除自己发布的内容</li>
            </ul>
            <p className="text-forest-800 leading-relaxed mb-4">
              <strong>内容审核：</strong>
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>我们有权但不义务审核用户发布的内容</li>
              <li>违反政策的内容将被删除，账户可能被封禁</li>
              <li>严重违规者将被永久禁止使用服务</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              5. 知识产权
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              <strong>平台内容：</strong> PetKeeper 的标志、设计、代码、物种图鉴数据等归平台所有，受著作权法保护。未经许可，不得复制、修改、传播或用于商业目的。
            </p>
            <p className="text-forest-800 leading-relaxed mb-4">
              <strong>用户内容：</strong> 用户发布的宠物照片、饲养心得等内容，版权归用户所有。发布即表示您授权其他用户在平台内浏览和评论。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              6. 服务变更与中断
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们保留以下权利：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>随时修改、暂停或终止服务的任何部分</li>
              <li>调整服务功能、界面和定价（如适用）</li>
              <li>限制用户对部分功能的访问</li>
              <li>因维护、升级或不可抗力导致的服务中断</li>
            </ul>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们将尽力提前通知重大变更，但不对服务中断造成的损失承担责任。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              7. 免责声明
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              <strong>服务按"现状"提供</strong>，我们不对以下情况做出保证：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>服务不会中断或无错误</li>
              <li>平台内容的准确性、完整性或时效性</li>
              <li>用户发布内容的真实性和可靠性</li>
              <li>饲养建议的适用性（请咨询专业兽医）</li>
            </ul>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们不对因使用本服务而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              8. 隐私保护
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们重视您的隐私。详细信息请参阅我们的{' '}
              <Link href="/privacy" className="text-forest-600 hover:text-forest-700 underline">
                隐私政策
              </Link>
              。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              9. 争议解决
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              如发生争议，双方应首先通过友好协商解决。协商不成的，任何一方可向我们所在地有管辖权的人民法院提起诉讼。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              10. 条款修改
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              我们有权随时修改本条款。修改后的条款将在平台上公布。继续使用服务即表示您接受修改后的条款。如不同意，请停止使用本服务。
            </p>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              11. 其他条款
            </h2>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li><strong>可分割性</strong>：如本条款任何条款被认定为无效，不影响其他条款的效力</li>
              <li><strong>完整协议</strong>：本条款构成您与我们之间的完整协议</li>
              <li><strong>法律适用</strong>：本条款受中华人民共和国法律管辖</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-forest-950 mt-8 mb-4">
              12. 联系我们
            </h2>
            <p className="text-forest-800 leading-relaxed mb-4">
              如对本条款有任何疑问，请联系：
            </p>
            <ul className="list-disc list-inside text-forest-800 space-y-2 mb-4">
              <li>电子邮件：legal@petkeeper.com</li>
              <li>社区反馈：在社区版块发布问题</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}