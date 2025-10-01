# Generated manually

from django.db import migrations

def update_photo_titles(apps, schema_editor):
    Photo = apps.get_model('website', 'Photo')
    
    # Обновляем preparation_team_1
    photo1 = Photo.objects.filter(photo_type='preparation_team_1').first()
    if photo1:
        photo1.title = 'Подготовка к отопительному сезону - Команда 1 (str8/photougtt)'
        photo1.save()
    
    # Обновляем preparation_team_2
    photo2 = Photo.objects.filter(photo_type='preparation_team_2').first()
    if photo2:
        photo2.title = 'Подготовка к отопительному сезону - Команда 2 (str8/photoyktt)'
        photo2.save()

def reverse_update_photo_titles(apps, schema_editor):
    Photo = apps.get_model('website', 'Photo')
    
    # Возвращаем старые названия
    photo1 = Photo.objects.filter(photo_type='preparation_team_1').first()
    if photo1:
        photo1.title = 'Подготовка к отопительному сезону - Команда 1 (str8/photoug)'
        photo1.save()
    
    photo2 = Photo.objects.filter(photo_type='preparation_team_2').first()
    if photo2:
        photo2.title = 'Подготовка к отопительному сезону - Команда 2 (str8/photoyk)'
        photo2.save()

class Migration(migrations.Migration):

    dependencies = [
        ('website', '0012_alter_photo_photo_type'),
    ]

    operations = [
        migrations.RunPython(update_photo_titles, reverse_update_photo_titles),
    ]


