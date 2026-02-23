from django.shortcuts import render, HttpResponse, redirect
from django.contrib import admin, messages
from django.urls import path
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from .forms import CustomUserCreationForm

def home(request):
    return render(request, 'anyapp/home.html')

def services(request):
    return render(request, 'anyapp/services.html')

def about(request):
    return render(request, 'anyapp/about.html')

def settings(request):
    if request.method == 'POST':
        # Check if user is authenticated before processing form
        if not request.user.is_authenticated:
            messages.error(request, 'Please log in to update settings')
            return redirect('login')
        
        user = request.user
        
        # Get form data
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        email = request.POST.get('email', '').strip()
        username = request.POST.get('username', '').strip()
        
        # Validate username is not empty
        if not username:
            messages.error(request, 'Username cannot be empty')
            return render(request, 'anyapp/settings.html')
        
        # Check if username is taken by another user
        if username != user.username:
            if User.objects.filter(username=username).exists():
                messages.error(request, 'Username already taken')
                return render(request, 'anyapp/settings.html')
        
        # Update user fields
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.username = username
        
        try:
            user.save()
            messages.success(request, 'Settings updated successfully!')
        except Exception as e:
            messages.error(request, f'Error updating settings: {str(e)}')
    
    return render(request, 'anyapp/settings.html')

def login_users(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            user = User.objects.get(username=username)
        except:
            #print('Username does not exist')
            messages.error(request, 'Username does not exist')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
           # print('Username or password is incorrect')
            messages.error(request, 'Username or password is incorrect')
    return render(request, 'anyapp/login.html')

def logout_users(request):
    logout(request)
    messages.success(request, 'Logged out successfully')
    return redirect('login')

def register_users(request):
    page = 'register'
    form = CustomUserCreationForm()
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            messages.success(request, 'User account created successfully!')
            login(request, user)
            return redirect('home')
    context = {'page': page, 'form': form}
    return render(request, 'anyapp/login.html', context)