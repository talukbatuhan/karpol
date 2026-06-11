-- Seed published products from legacy static catalog (TR/EN content)
insert into public.products (
  slug,
  category,
  status,
  title_tr,
  title_en,
  description_tr,
  description_en,
  body_tr,
  body_en,
  metadata
) values
(
  'makara',
  'makara',
  'published',
  'Makara kutusu',
  'Roller box',
  '3D görselleştirici ve sevkiyat verileri',
  '3D visualization and shipment data',
  'Makara ambalajları için hacim, ağırlık ve sevkiyat optimizasyonu. Boyut seçimi ve 3D kutu görselleştirmesi ile sahada sürprizleri azaltın.',
  'Volume, weight and shipment optimization for roller packaging. Reduce surprises in the field with size selection and 3D box visualization.',
  jsonb_build_object(
    'tool_href', '/tools/makara',
    'specs', jsonb_build_array(
      jsonb_build_object('label_tr', 'Malzeme', 'label_en', 'Material', 'value_tr', 'Poliüretan / karton kompozit', 'value_en', 'Polyurethane / cardboard composite'),
      jsonb_build_object('label_tr', 'Kullanım', 'label_en', 'Use', 'value_tr', 'Kablo · tel · endüstriyel sarım', 'value_en', 'Cable · wire · industrial winding'),
      jsonb_build_object('label_tr', 'Norm / ölçü', 'label_en', 'Norm / size', 'value_tr', 'Özel ölçü · müşteri çizimi', 'value_en', 'Custom size · customer drawing')
    ),
    'assets', jsonb_build_object()
  )
),
(
  'damper',
  'tip_bt',
  'published',
  'Titreşim takozu',
  'Vibration damper',
  'Kauçuk takoz tasarım sistemi',
  'Rubber damper design system',
  'Makine ve hat titreşimlerini izole eden kauçuk takozlar. Sertlik, geometri ve montaj yüzeyine göre konfigürasyon.',
  'Rubber dampers that isolate machine and line vibrations. Configuration by hardness, geometry and mounting surface.',
  jsonb_build_object(
    'tool_href', '/tools/kaucuk-titresim-takozlari',
    'specs', jsonb_build_array(
      jsonb_build_object('label_tr', 'Malzeme', 'label_en', 'Material', 'value_tr', 'Kauçuk · poliüretan bileşen', 'value_en', 'Rubber · polyurethane compound'),
      jsonb_build_object('label_tr', 'Kullanım', 'label_en', 'Use', 'value_tr', 'Titreşim izolasyonu', 'value_en', 'Vibration isolation'),
      jsonb_build_object('label_tr', 'Norm / ölçü', 'label_en', 'Norm / size', 'value_tr', 'Özel formülasyon', 'value_en', 'Custom formulation')
    ),
    'assets', jsonb_build_object()
  )
),
(
  'silim',
  'silim',
  'published',
  'Silim lastiği',
  'Grinding pad',
  'Endüstriyel silim ve yüzey uygulamaları',
  'Industrial grinding and surface applications',
  'Aşındırıcı ve yüzey işleme uygulamaları için silim lastiği çözümleri. Operasyon koşuluna göre sertlik ve bağlama seçenekleri.',
  'Grinding pad solutions for abrasive and surface processing. Hardness and bonding options per operating conditions.',
  jsonb_build_object(
    'tool_href', '/tools/silim-lastigi',
    'specs', jsonb_build_array(
      jsonb_build_object('label_tr', 'Malzeme', 'label_en', 'Material', 'value_tr', 'Kauçuk bazlı aşındırıcı', 'value_en', 'Rubber-based abrasive'),
      jsonb_build_object('label_tr', 'Kullanım', 'label_en', 'Use', 'value_tr', 'Yüzey işleme · hat silimi', 'value_en', 'Surface processing · line grinding'),
      jsonb_build_object('label_tr', 'Norm / ölçü', 'label_en', 'Norm / size', 'value_tr', 'Özel ölçü', 'value_en', 'Custom size')
    ),
    'assets', jsonb_build_object()
  )
)
on conflict (slug) do nothing;
