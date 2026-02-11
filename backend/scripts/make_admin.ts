import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
    console.log(`🔍 Looking for user with email: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: { couple: true }
    });

    if (!user) {
        console.error('❌ User not found!');
        return;
    }

    console.log(`✅ User found: ${user.name || 'No Name'} (${user.id})`);

    let coupleId = user.coupleId;

    if (!coupleId) {
        console.log('⚠️ User has no couple. Creating one...');
        const couple = await prisma.couple.create({
            data: {
                ownerUserId: user.id,
                planType: 'vitalicio', // Max level PRO
                planExpiresAt: null, // Never expires
            }
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                coupleId: couple.id,
                role: 'owner'
            }
        });

        coupleId = couple.id;
        console.log(`✅ Couple created: ${couple.id}`);
    } else {
        console.log(`✅ User already has couple: ${coupleId}. Upgrading...`);
        await prisma.couple.update({
            where: { id: coupleId },
            data: {
                planType: 'vitalicio',
                planExpiresAt: null
            }
        });
    }

    console.log('🎉 SUCCESS! User is now PRO (Vitalício).');
}

// Get email from command line arg or use default
const targetEmail = process.argv[2] || 'rafaelleaobh@gmail.com';
makeAdmin(targetEmail)
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
