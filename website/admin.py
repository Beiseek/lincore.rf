from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    ContactInfo, ServiceApplication, TenderInvitation,
    Photo, GalleryPhoto, PhotoGroup, GalleryGroup, ComplexGalleryGroup, HeatingGalleryGroup, VerificationGalleryGroup, EmergencyPhotoGroup, AuditGalleryGroup, PreparationGalleryGroup, VentilationPhotoGroup, HeatingPhotoGroup
)

# Создаем группы в админ панели - регистрация будет в конце файла


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'phone_main']
    fieldsets = (
        ('Основная информация', {
            'fields': ('address',)
        }),
        ('Единый номер телефона', {
            'fields': ('phone_main',),
            'description': 'Этот номер будет использоваться на всех страницах сайта и в шапке'
        }),
        ('Контент', {
            'fields': ('tender_invitation',)
        }),
    )
    
    def has_add_permission(self, request):
        # Разрешить создание только если объекта еще нет
        return not ContactInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Не разрешать удаление
        return False


@admin.register(ServiceApplication)
class ServiceApplicationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'service_type_display', 'request_type_display', 'created_at', 'processed']
    list_filter = ['service_type', 'request_type', 'processed', 'created_at']
    search_fields = ['full_name', 'phone']
    readonly_fields = ['created_at']
    list_editable = ['processed']
    date_hierarchy = 'created_at'
    
    def service_type_display(self, obj):
        return obj.get_service_type_display()
    service_type_display.short_description = 'Тип услуги'
    
    def request_type_display(self, obj):
        return obj.get_request_type_display()
    request_type_display.short_description = 'Тип заявки'
    
    fieldsets = (
        ('Данные заявителя', {
            'fields': ('full_name', 'phone', 'organization')
        }),
        ('Информация о заявке', {
            'fields': ('service_type', 'request_type', 'message', 'preferred_time', 'created_at', 'processed')
        }),
    )


@admin.register(TenderInvitation)
class TenderInvitationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'company_name', 'phone', 'agreed_to_processing', 'created_at', 'processed']
    list_filter = ['agreed_to_processing', 'processed', 'created_at']
    search_fields = ['full_name', 'company_name', 'phone']
    readonly_fields = ['created_at']
    list_editable = ['processed']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Данные заявителя', {
            'fields': ('full_name', 'phone', 'company_name')
        }),
        ('Дополнительная информация', {
            'fields': ('technical_task', 'agreed_to_processing')
        }),
        ('Системная информация', {
            'fields': ('created_at', 'processed'),
            'classes': ('collapse',)
        }),
    )


# Админ для галереи главной страницы (фотографии объектов - можно добавлять дополнительные)
class GalleryPhotoAdmin(admin.ModelAdmin):
    list_display = ['title', 'gallery_type_display', 'image_preview', 'order', 'is_active', 'created_at']
    list_filter = ['gallery_type', 'is_active', 'created_at']
    search_fields = ['title', 'alt_text']
    readonly_fields = ['image_preview', 'created_at', 'updated_at']
    list_editable = ['order', 'is_active']
    ordering = ['gallery_type', 'order', 'created_at']
    
    def gallery_type_display(self, obj):
        return obj.get_gallery_type_display()
    gallery_type_display.short_description = 'Тип галереи'
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 200px;" />',
                obj.image.url
            )
        return "Нет изображения"
    image_preview.short_description = 'Предварительный просмотр'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'gallery_type', 'alt_text')
        }),
        ('Изображение', {
            'fields': ('image', 'image_preview')
        }),
        ('Настройки отображения', {
            'fields': ('order', 'is_active')
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['make_active', 'make_inactive']
    
    def make_active(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} фотографий активировано.')
    make_active.short_description = "Активировать выбранные фотографии"
    
    def make_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} фотографий деактивировано.')
    make_inactive.short_description = "Деактивировать выбранные фотографии"
    
    def get_queryset(self, request):
        """Фильтруем только галерею объектов главной страницы"""
        qs = super().get_queryset(request)
        return qs.filter(gallery_type='main_objects')
    
    class Meta:
        verbose_name = "Галерея главной страницы"
        verbose_name_plural = "Галерея главной страницы"


# Админ для фото главной страницы (4 фотографии команды - только замена)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['title', 'photo_type_display', 'image_preview', 'updated_at']
    list_filter = ['photo_type', 'updated_at']
    search_fields = ['title', 'alt_text']
    readonly_fields = ['image_preview', 'updated_at']
    
    def photo_type_display(self, obj):
        return obj.get_photo_type_display()
    photo_type_display.short_description = 'Тип фотографии'
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 200px; max-height: 200px;" />',
                obj.image.url
            )
        return "Нет изображения"
    image_preview.short_description = 'Предварительный просмотр'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'photo_type', 'alt_text')
        }),
        ('Изображение', {
            'fields': ('image', 'image_preview')
        }),
        ('Системная информация', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Фильтруем только фотографии команды главной страницы"""
        qs = super().get_queryset(request)
        return qs.filter(photo_type__startswith='main_team')
    
    class Meta:
        verbose_name = "Фото главной страницы"
        verbose_name_plural = "Фото главной страницы"




# Настройка заголовков админки
admin.site.site_header = "Админ-панель инженерно-сервисной компании"
admin.site.site_title = "Админ-панель"
admin.site.index_title = "Управление сайтом"

# Админ классы для proxy моделей
class PhotoGroupAdmin(PhotoAdmin):
    """Админ для группы Фото"""
    pass

class GalleryGroupAdmin(GalleryPhotoAdmin):
    """Админ для группы Фотогалерея"""
    pass

class ComplexGalleryGroupAdmin(GalleryPhotoAdmin):
    """Админ для группы Галерея Комплексное обслуживание инженерных систем"""
    
    def get_queryset(self, request):
        """Фильтруем только галерею комплексного обслуживания"""
        # Получаем базовый queryset без фильтрации
        qs = super(GalleryPhotoAdmin, self).get_queryset(request)
        return qs.filter(gallery_type='complex_objects')
    
    class Meta:
        verbose_name = "Галерея Комплексное обслуживание инженерных систем"
        verbose_name_plural = "Галерея Комплексное обслуживание инженерных систем"

class HeatingGalleryGroupAdmin(GalleryPhotoAdmin):
    """Админ для группы Галерея Комплексное обслуживание ИТП и ЦТП «под ключ»"""
    
    def get_queryset(self, request):
        """Фильтруем только галерею ИТП и ЦТП"""
        # Получаем базовый queryset без фильтрации
        qs = super(GalleryPhotoAdmin, self).get_queryset(request)
        return qs.filter(gallery_type='heating_objects')
    
    class Meta:
        verbose_name = "Галерея Комплексное обслуживание ИТП и ЦТП «под ключ»"
        verbose_name_plural = "Галерея Комплексное обслуживание ИТП и ЦТП «под ключ»"

class VerificationGalleryGroupAdmin(GalleryPhotoAdmin):
    """Админ для группы Галерея Поверка, ремонт и восстановление приборов учета"""
    
    def get_queryset(self, request):
        """Фильтруем только галерею поверки"""
        # Получаем базовый queryset без фильтрации
        qs = super(GalleryPhotoAdmin, self).get_queryset(request)
        return qs.filter(gallery_type='verification_objects')
    
    class Meta:
        verbose_name = "Галерея Поверка, ремонт и восстановление приборов учета"
        verbose_name_plural = "Галерея Поверка, ремонт и восстановление приборов учета"

class EmergencyPhotoGroupAdmin(PhotoAdmin):
    """Админ для группы Фото Аварийная служба"""
    
    def get_queryset(self, request):
        """Фильтруем только фотографии аварийной службы"""
        # Получаем базовый queryset без фильтрации
        qs = super(PhotoAdmin, self).get_queryset(request)
        return qs.filter(photo_type__startswith='emergency_photo')
    
    class Meta:
        verbose_name = "Фото Аварийная служба"
        verbose_name_plural = "Фото Аварийная служба"

class AuditGalleryGroupAdmin(GalleryPhotoAdmin):
    """Админ для группы Галерея Аудит инженерных систем для госзаказчиков"""
    
    def get_queryset(self, request):
        """Фильтруем только галерею аудита"""
        # Получаем базовый queryset без фильтрации
        qs = super(GalleryPhotoAdmin, self).get_queryset(request)
        return qs.filter(gallery_type='audit_objects')
    
    class Meta:
        verbose_name = "Галерея Аудит инженерных систем для госзаказчиков"
        verbose_name_plural = "Галерея Аудит инженерных систем для госзаказчиков"

class PreparationGalleryGroupAdmin(GalleryPhotoAdmin):
    """Админ для группы Галерея Подготовка к отопительному сезону"""
    
    def get_queryset(self, request):
        """Фильтруем только галерею подготовки к отопительному сезону"""
        # Получаем базовый queryset без фильтрации
        qs = super(GalleryPhotoAdmin, self).get_queryset(request)
        return qs.filter(gallery_type='preparation_objects')
    
    class Meta:
        verbose_name = "Галерея Подготовка к отопительному сезону"
        verbose_name_plural = "Галерея Подготовка к отопительному сезону"

class VentilationPhotoGroupAdmin(PhotoAdmin):
    """Админ для группы Фото Профессиональное техническое обслуживание"""
    
    def get_queryset(self, request):
        """Фильтруем только фотографии вентиляции"""
        # Получаем базовый queryset без фильтрации
        qs = super(PhotoAdmin, self).get_queryset(request)
        return qs.filter(photo_type__startswith='ventilation_team')
    
    class Meta:
        verbose_name = "Фото Профессиональное техническое обслуживание"
        verbose_name_plural = "Фото Профессиональное техническое обслуживание"

class HeatingPhotoGroupAdmin(PhotoAdmin):
    """Админ для группы Фото Комплексное обслуживание ИТП и ЦТП «под ключ»"""

    def get_queryset(self, request):
        """Фильтруем только фотографии ИТП и ЦТП"""
        # Получаем базовый queryset без фильтрации
        qs = super(PhotoAdmin, self).get_queryset(request)
        return qs.filter(photo_type__startswith='heating_professional')

    class Meta:
        verbose_name = "Фото Комплексное обслуживание ИТП и ЦТП «под ключ»"
        verbose_name_plural = "Фото Комплексное обслуживание ИТП и ЦТП «под ключ»"


# Регистрируем proxy модели вместо основных
admin.site.register(PhotoGroup, PhotoGroupAdmin)
admin.site.register(GalleryGroup, GalleryGroupAdmin)
admin.site.register(ComplexGalleryGroup, ComplexGalleryGroupAdmin)
admin.site.register(HeatingGalleryGroup, HeatingGalleryGroupAdmin)
admin.site.register(VerificationGalleryGroup, VerificationGalleryGroupAdmin)
admin.site.register(EmergencyPhotoGroup, EmergencyPhotoGroupAdmin)
admin.site.register(AuditGalleryGroup, AuditGalleryGroupAdmin)
admin.site.register(PreparationGalleryGroup, PreparationGalleryGroupAdmin)
admin.site.register(VentilationPhotoGroup, VentilationPhotoGroupAdmin)
admin.site.register(HeatingPhotoGroup, HeatingPhotoGroupAdmin)

# Переопределяем verbose_name для proxy моделей в админке
PhotoGroup._meta.verbose_name = "Фото главной страницы"
PhotoGroup._meta.verbose_name_plural = "Фото главной страницы"
GalleryGroup._meta.verbose_name = "Галерея главной страницы"
GalleryGroup._meta.verbose_name_plural = "Галерея главной страницы"
ComplexGalleryGroup._meta.verbose_name = "Галерея Комплексное обслуживание инженерных систем"
ComplexGalleryGroup._meta.verbose_name_plural = "Галерея Комплексное обслуживание инженерных систем"
HeatingGalleryGroup._meta.verbose_name = "Галерея Комплексное обслуживание ИТП и ЦТП «под ключ»"
HeatingGalleryGroup._meta.verbose_name_plural = "Галерея Комплексное обслуживание ИТП и ЦТП «под ключ»"
VerificationGalleryGroup._meta.verbose_name = "Галерея Поверка, ремонт и восстановление приборов учета"
VerificationGalleryGroup._meta.verbose_name_plural = "Галерея Поверка, ремонт и восстановление приборов учета"
EmergencyPhotoGroup._meta.verbose_name = "Фото Аварийная служба"
EmergencyPhotoGroup._meta.verbose_name_plural = "Фото Аварийная служба"
AuditGalleryGroup._meta.verbose_name = "Галерея Аудит инженерных систем для госзаказчиков"
AuditGalleryGroup._meta.verbose_name_plural = "Галерея Аудит инженерных систем для госзаказчиков"
PreparationGalleryGroup._meta.verbose_name = "Галерея Подготовка к отопительному сезону"
PreparationGalleryGroup._meta.verbose_name_plural = "Галерея Подготовка к отопительному сезону"
VentilationPhotoGroup._meta.verbose_name = "Фото Профессиональное техническое обслуживание"
VentilationPhotoGroup._meta.verbose_name_plural = "Фото Профессиональное техническое обслуживание"
HeatingPhotoGroup._meta.verbose_name = "Фото Комплексное обслуживание ИТП и ЦТП «под ключ»"
HeatingPhotoGroup._meta.verbose_name_plural = "Фото Комплексное обслуживание ИТП и ЦТП «под ключ»"