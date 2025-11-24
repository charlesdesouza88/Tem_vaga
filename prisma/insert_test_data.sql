-- Insert Service and Hours for the test user (supabase4@test.com)

DO $$
DECLARE
    v_user_id TEXT;
    v_business_id TEXT;
BEGIN
    -- Get User ID
    SELECT "id" INTO v_user_id FROM "User" WHERE "email" = 'supabase4@test.com';
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User supabase4@test.com not found';
        RETURN;
    END IF;

    -- Get Business ID
    SELECT "id" INTO v_business_id FROM "Business" WHERE "ownerId" = v_user_id;

    IF v_business_id IS NULL THEN
        RAISE NOTICE 'Business for user not found';
        RETURN;
    END IF;

    -- Update Slug to known value for testing
    UPDATE "Business" SET "slug" = 'supabase-user-4-test' WHERE "id" = v_business_id;

    -- Insert Service
    INSERT INTO "Servico" ("id", "businessId", "nome", "descricao", "preco", "duracaoMin", "ativo")
    VALUES (
        gen_random_uuid()::text,
        v_business_id,
        'Corte de Cabelo',
        'Corte masculino completo com acabamento',
        35,
        30,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Insert Hours (Monday to Friday, 9am to 6pm)
    INSERT INTO "HorarioAtendimento" ("id", "businessId", "diaSemana", "inicio", "fim", "ativo")
    VALUES 
        (gen_random_uuid()::text, v_business_id, 1, '09:00', '18:00', true), -- Monday
        (gen_random_uuid()::text, v_business_id, 2, '09:00', '18:00', true), -- Tuesday
        (gen_random_uuid()::text, v_business_id, 3, '09:00', '18:00', true), -- Wednesday
        (gen_random_uuid()::text, v_business_id, 4, '09:00', '18:00', true), -- Thursday
        (gen_random_uuid()::text, v_business_id, 5, '09:00', '18:00', true); -- Friday

    RAISE NOTICE 'Test data inserted successfully for business %', v_business_id;
END $$;
