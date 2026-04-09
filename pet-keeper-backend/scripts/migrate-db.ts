# 数据库迁移脚本（SQLite → PostgreSQL）
import { PrismaClient } from '@prisma/client'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const oldDb = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
})

const newDb = new PrismaClient()

async function migrate() {
  console.log('🚀 开始数据库迁移...')

  try {
    // 1. 迁移用户
    console.log('📦 迁移用户数据...')
    const users = await oldDb.user.findMany()
    for (const user of users) {
      await newDb.user.create({ data: user })
    }
    console.log(`✅ 迁移用户: ${users.length}`)

    // 2. 迁移物种
    console.log('📦 迁移物种数据...')
    const species = await oldDb.species.findMany()
    for (const sp of species) {
      await newDb.species.create({ data: sp })
    }
    console.log(`✅ 迁移物种: ${species.length}`)

    // 3. 迁移宠物
    console.log('📦 迁移宠物数据...')
    const pets = await oldDb.pet.findMany()
    for (const pet of pets) {
      await newDb.pet.create({ data: pet })
    }
    console.log(`✅ 迁移宠物: ${pets.length}`)

    // 4. 迁移帖子
    console.log('📦 迁移帖子数据...')
    const posts = await oldDb.post.findMany()
    for (const post of posts) {
      await newDb.post.create({ data: post })
    }
    console.log(`✅ 迁移帖子: ${posts.length}`)

    // 5. 迁移商品
    console.log('📦 迁移商品数据...')
    const categories = await oldDb.productCategory.findMany()
    for (const cat of categories) {
      await newDb.productCategory.create({ data: cat })
    }
    console.log(`✅ 迁移分类: ${categories.length}`)

    const products = await oldDb.product.findMany()
    for (const prod of products) {
      await newDb.product.create({ data: prod })
    }
    console.log(`✅ 迁移商品: ${products.length}`)

    // 6. 迁移订单
    console.log('📦 迁移订单数据...')
    const orders = await oldDb.order.findMany()
    for (const order of orders) {
      await newDb.order.create({
        data: {
          ...order,
          items: {
            create: await oldDb.orderItem.findMany({
              where: { orderId: order.id }
            })
          }
        }
      })
    }
    console.log(`✅ 迁移订单: ${orders.length}`)

    // 7. 迁移地址
    console.log('📦 迁移地址数据...')
    const addresses = await oldDb.address.findMany()
    for (const addr of addresses) {
      await newDb.address.create({ data: addr })
    }
    console.log(`✅ 迁移地址: ${addresses.length}`)

    console.log('✨ 迁移完成！')
  } catch (error) {
    console.error('❌ 迁移失败:', error)
    process.exit(1)
  } finally {
    await oldDb.$disconnect()
    await newDb.$disconnect()
  }
}

migrate()